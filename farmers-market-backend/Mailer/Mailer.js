const mailer = require("nodemailer");

class Mailer {
  constructor() {
    this.transporter = null;
    this.senderAccount = null;
    this.receivers = []; // Database of receivers: { email, pass, outbox: [] }
  }

  /**
   * Initializes the sender account (The "Fruit Garden" Admin)
   */
  async setupSender() {
    this.senderAccount = await mailer.createTestAccount();
    this.transporter = mailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: this.senderAccount.user,
        pass: this.senderAccount.pass,
      },
    });
    console.log(`\n🚀 Master Sender Configured: ${this.senderAccount.user}`);
  }

  /**
   * METHOD 1: Create a new receiver account
   * This simply adds a new user to your 'receivers' array.
   */
  async createReceiver() {
    const account = await mailer.createTestAccount();
    const newReceiver = {
      email: account.user,
      pass: account.pass,
      outbox: [] // This will store every unique preview link sent to this user
    };

    this.receivers.push(newReceiver);
    console.log(`👤 Receiver Created: ${newReceiver.email} (Index: ${this.receivers.length - 1})`);
    
    return this.receivers.length - 1; // Returns index for the 'send' method
  }

  /**
   * METHOD 2: Send email to a specific receiver
   * Generates a unique preview link for every single delivery.
   */
  async sendToReceiver(index, code) {
    // 1. Ensure the sender is ready
    if (!this.transporter) await this.setupSender();

    // 2. Locate the specific receiver
    const target = this.receivers[index];
    if (!target) {
      console.error("❌ Error: Receiver index not found.");
      return;
    }

    const message = {
      from: `"Fruit Garden Admin" <${this.senderAccount.user}>`,
      to: target.email,
      subject: "Your Fruit Verification Code",
      text: `Hello! Your garden code is: ${code}`,
      html: `<div style="padding:20px; border:1px solid #ddd;">
               <h3>Welcome to the Garden!</h3>
               <p>Your unique code is: <strong>${code}</strong></p>
             </div>`,
    };

    try {
      const info = await this.transporter.sendMail(message);
      
      // Generate the unique link for THIS specific email
      const previewLink = mailer.getTestMessageUrl(info);

      const deliveryLog = {
        codeSent: code,
        previewLink: previewLink,
        sentAt: new Date().toLocaleTimeString()
      };

      // Push to this specific receiver's history
      target.outbox.push(deliveryLog);

      this.printDeliverySummary(target.email, deliveryLog);
      return deliveryLog;
    } catch (err) {
      console.error(`❌ Failed to send to ${target.email}:`, err);
    }
  }

  /**
   * Helper to print details to the console
   */
  printDeliverySummary(email, log) {
    console.log(`\n-----------------------------------------`);
    console.log(`✉️  EMAIL SENT TO: ${email}`);
    console.log(`🔑 CODE: ${log.codeSent}`);
    console.log(`🔗 PREVIEW LINK: ${log.previewLink}`);
    console.log(`-----------------------------------------`);
  }
}

// --- Execution Example ---

const run = async () => {
  const gardenMailer = new Mailer();

  // Create two distinct receivers
  const user1 = await gardenMailer.createReceiver();
  const user2 = await gardenMailer.createReceiver();

  // Send an email to the first receiver
  await gardenMailer.sendToReceiver(user1, "APPLE-123");

  // Send an email to the second receiver
  await gardenMailer.sendToReceiver(user2, "CHERRY-456");

  // Send ANOTHER email to the first receiver (it gets its own unique link!)
  await gardenMailer.sendToReceiver(user1, "RETRY-789");
  
  console.log(`\n📊 Total receivers in system: ${gardenMailer.receivers.length}`);
};

run();

module.exports = { Mailer };  