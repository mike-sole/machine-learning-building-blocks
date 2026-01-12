The Single Perceptron is a powerful linear classifier, but it is fundamentally limited to **linearly separable** data. For problems where classes cannot be separated by a straight line, a single perceptron is insufficient. To address this limitation, we arrange multiple neurons into a layered architecture. This structure is known as the **Multi-Layered Perceptron (MLP)** or **Neural Network**.

An MLP is composed of three distinct types of layers:

1.  **Input Layer**: Accepts the initial feature vector.
2.  **Hidden Layer(s)**: Intermediate layers that transform the input data into a new representation. These layers enable the network to learn non-linear relationships.
3.  **Output Layer**: Produces the final prediction or classification.

By stacking these layers, the network acts as a **universal function approximator**, capable of modeling complex, **non-linear decision boundaries**.

The following diagram illustrates a standard MLP configuration with 2 inputs, a single hidden layer of 3 neurons, and 1 output. In this **Fully Connected** (or **Dense**) network, each neuron in a given layer connects to every neuron in the subsequent layer.

```graph
mlp-architecture
```

## Adding non-linearity

The standard perceptron equation ($z = w \cdot x + b$) is entirely **linear**. It is simply a weighted sum. To enable the network to learn complex, non-linear patterns, we must pass this linear sum ($z$) through a non-linear **Activation Function** ($\sigma$) before passing it to the next layer.

ReLU is the modern standard activation function. It is deceptively simple: it outputs the input directly if it is positive, otherwise, it outputs zero.

```graph
relu-function
```

## Exploring MLP decision boundaries for XOR

The following interactive graph demonstrates how a 2-Hidden-Layer MLP transforms the non-linear XOR input space into a linearly separable space. More specifically, we define:
* points (2, 2) and (-2, -2) as spam
* points (2, -2) and (-2, 2) as non-spam

This interactive graph is unique: rather than showing a single pass of data e.g. one of the four points as input, each neuron displays a **decision boundary graph** showing how it processes the **entire XOR dataset**:

*   **The Bias Trick**: Notice the extra input $x_0$. As introduced in [The Perceptron Model](/machine-learning-building-blocks/post/the-perceptron-model), this Fixed Input of 1 allows us to treat the bias ($b$) as just another learnable weight ($w_0$).

*   **Hidden Neurons ($h_1, h_2$)**: These graphs plot the original Input Space ($x_1, x_2$). Using the same style of graph as [The Perceptron Model](/machine-learning-building-blocks/post/the-perceptron-model), the dashed line is the decision boundary formed by that neuron's weights. The weight vector and bias related points are interactive, allowing you to adjust them to see how they affect the decision boundary.
    *   Spam and non-spam points are highlighted in red and green respectively, their activation values are shown below their labels. Note that these are the **weighted sum values** when >= 0, **otherwise they are 0 following the ReLU activation function**.

*   **Output Neuron ($\hat{y}$)**: This graph plots the **Tranformed Feature Space** ($h_1, h_2$). Its axes are the *outputs* of the hidden neurons - its x and y axis correspond to the outputs of $h_1$ and $h_2$ respectively. If the hidden layer successfully disentangles the XOR pattern, the points in this space will be linearly separable, allowing the output neuron to draw a final clean boundary.

**Try it:** Adjust the weights of the hidden neurons by dragging the weight vector and bias related points to see how they affect the decision boundary.

```graph
mlp-decision-boundaries
```

## Code

Here is how we can calculate the network's predictions in Python. Using the **Bias Trick**, we can compute the output for each input using the exact weights from the interactive graph above:

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

# Inputs: [1 for bias trick, x1, x2]
inputs = np.array([
    [1,  2.0,  2.0], # Spam     
    [1, -2.0, -2.0], # Spam     
    [1, -2.0,  2.0], # Not Spam 
    [1,  2.0, -2.0]  # Not Spam
])

# Targets (Spam / Not Spam)
targets = ["Spam", "Spam", "Not Spam", "Not Spam"]

# Hidden Layer 1 Weights
w_h1 = np.array([0.3, 1.0, 1.0])

# Hidden Layer 2 Weights
w_h2 = np.array([0.56, -0.95, -1.05])

# Output Layer Weights
w_out = np.array([-2.41, 0.84, 0.86])

print(f"{'Input':<12} | {'H1':<6} | {'H2':<6} | {'Score':<6} | {'Predicted':<10} | {'Target':<10} | Met?")
print("-" * 75)

for i, input in enumerate(inputs):
    # Hidden Layer Pass
    h1 = relu(np.dot(input, w_h1))
    h2 = relu(np.dot(input, w_h2))
    
    # Output Pass (1 at the start for bias trick)
    hidden_out = np.array([1, h1, h2])
    z_final = np.dot(hidden_out, w_out)
    
    decision = "Spam" if z_final > 0 else "Not Spam"
    target = targets[i]
    met = "✅" if decision == target else "❌"
    
    print(f"{str(input[1:]):<12} | {h1:<6.2f} | {h2:<6.2f} | {z_final:<6.2f} | {decision:<10} | {target:<10} | {met}")
```

```text
Output
Input        | H1     | H2     | Score  | Predicted  | Target     | Met?
---------------------------------------------------------------------------
[ 2.  2.]    | 4.30   | 0.00   | 1.20   | Spam       | Spam       | ✅
[-2. -2.]    | 0.00   | 4.56   | 1.51   | Spam       | Spam       | ✅
[-2.  2.]    | 0.30   | 0.36   | -1.85  | Not Spam   | Not Spam   | ✅
[ 2. -2.]    | 0.30   | 0.76   | -1.50  | Not Spam   | Not Spam   | ✅
```

**Note:** The hidden layer has successfully transformed the non-linear input space into a linearly separable feature space, allowing the output neuron to correctly classify all points! 

## Maths Notations

The operation of a single neuron (computing a weighted sum then applying an activation function $\sigma$) is often written with vectors:

$$ 
z = w \cdot x + b 
$$

$$
y = \sigma(z) 
$$

In a multi-layered network, we use matrices to represent the weights of an entire layer simultaneously.

Hidden Layer ($h$):

$$ 
z_1 = W_1 x + b_1 
$$

$$ 
h = f(z_1) 
$$

Output Layer ($\hat{y}$):

$$ 
z_2 = W_2 h + b_2 
$$

$$
\hat{y} = g(z_2) 
$$

Key Differences between single neuron and multi-layered network notation:
*   $W$ (Capitalized): Represents a **Matrix** of weights (connecting every input to every neuron in the layer).
*   **Removal of Dot ($\cdot$):** When multiplying a Matrix by a Vector ($W_1 x$), we typically drop the dot symbol, though keeping it is not strictly "wrong."
*   **Activation Functions ($f, g$):** These represent the non-linear functions applied to the layer's output. We use different letters to show that each layer might use a different function.


