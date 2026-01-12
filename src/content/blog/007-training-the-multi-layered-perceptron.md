With the architecture of the Multi-Layered Perceptron defined, the remaining challenge is optimization: determining the optimal set of weights ($w$) and biases ($b$) for the entire network.

In a single perceptron, weight updates are straightforward because the error can be directly attributed to the weights. In a deep network, however, the error at the output is the result of a complex chain of transformations. A change in a weight in the first layer propagates through all subsequent layers, affecting the final output non-linearly.

## Backpropagation

The standard algorithm for training neural networks is **Backpropagation**.

Backpropagation effectively distributes the error calculated at the output layer back through the network to update weights in previous layers. It relies on the **Chain Rule** of calculus to compute the gradient of the loss function with respect to every weight in the network.

$$ \frac{\partial Loss}{\partial w} = \frac{\partial Loss}{\partial y} \cdot \frac{\partial y}{\partial z} \cdot \frac{\partial z}{\partial w} $$

By computing these gradients, we can determine exactly how to adjust each weight to minimize the total error, allowing the network to learn from data iteratively.

