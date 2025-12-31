const tf = require("@tensorflow/tfjs")

// const tensor = tf.tensor([1,2,3,4])
const tensor = tf.tensor([
  [1, 2],
  [3, 4],
  [5, 6]
])

tensor.print()
console.log(tensor.shape);
