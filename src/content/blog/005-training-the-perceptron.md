In the [previous post](/post/the-perceptron-model), we saw how a Perceptron uses weights to draw a decision boundary. However, we manually chose those weights to fit our data. In practice, machine learning is about **learning weights automatically**.

The **Perceptron Learning Algorithm** is an iterative feedback loop. It works by making a prediction, checking if it was right, and fixing the weights if it was wrong.

1. **Initialise**: Start with weights set to 0 (or small random numbers).
2. **Loop**: Iterate through the dataset one by one.
3. **Predict**: Calculate the output for the current data point.
4. **Update**: If the prediction is wrong, "nudge" the weights towards the correct answer.
5. **Repeat**: Continue looping over the full dataset (an **Epoch**) until the model makes no mistakes, or a maximum number of epochs has been reached.

## Interactive Training

This interactive chart shows exactly how a **Perceptron** learns to separate data. When you click **"Train Step"**, it picks one data point and tries to predict which category it belongs to:

- **If it guesses right**: The model is already correct for the current data point, so nothing changes.
- **If it guesses wrong**: The model updates its weights to correct the mistake. You will see the decision boundary (the line) rotate or shift to better classify this point next time. The size of this shift is controlled by the **Learning Rate** ($\eta$)

  - If the **expected output** for the current data point was **1** but we predicted **0**, we add the scaled input vector ($\eta \cdot \text{Input}$) to the weights. This pulls the weight vector towards the input, making it more likely to classify it as **1** next time.

  - If the **expected output** for the current data point was **0** but we predicted **1**, we subtract the scaled input vector ($\eta \cdot \text{Input}$). This pushes the weight vector away, making it less likely to classify it as **1** next time.

Why use a **Learning Rate**? It acts as a "speed limit" for learning. Instead of adding the full input vector (which might cause the line to swing wildly), we only add a small fraction of it (e.g., $\eta = 0.05$ used by the interactive chart). This ensures the model learns the general trend rather than overreacting to a single point.

Note: to clearly demonstrate the bias, we do not use the **Bias Trick** here (where the bias is combined with the weights, as highlighted in the [previous post](/post/the-perceptron-model)).

```graph
perceptron-training
```

## Code

Here is the Python code that powers the logic above:
* Training data is a list of input vectors e.g. the points in the interactive chart
* Number of features is the number of dimensions in the input vectors e.g. the x and y coordinates of the points
* Labels is a list of binary target labels e.g. 1 for spam and 0 for not spam
* Learning rate is the step size for updating the weights
* Epochs is the number of times to iterate over the training data

```python
import numpy as np

def train_perceptron(training_data, labels, learning_rate=0.05, epochs=50):
    # 1. Initialize Weights
    num_features = training_data.shape[1]
    weights = np.zeros(num_features)
    bias = 0

    for epoch in range(epochs):
        # We zip the data and labels to iterate over them together
        for input_vector, target_label in zip(training_data, labels):
            
            # 2. Predict
            # Calculate weighted sum: w . x + b
            z = np.dot(input_vector, weights) + bias
            prediction = 1 if z > 0 else 0
            
            # 3. Calculate Error
            # If target is 1 and prediction is 0, error is 1
            # If target is 0 and prediction is 1, error is -1
            error = target_label - prediction
            
            # 4. Update Weights (only if there is an error)
            if error != 0:
                weights += learning_rate * error * input_vector
                bias += learning_rate * error

    return weights, bias


training_data = np.array([
    [4.0, 5.0], [5.0, 4.0], [3.0, 5.5], # Spam
    [2.0, 1.0], [3.0, 0.5], [1.0, 2.0]  # Not Spam
])
labels = np.array([
    1, 1, 1, # Spam
    0, 0, 0  # Not Spam
])

weights, bias = train_perceptron(training_data, labels)
print(f"Final Weights: {weights}")
print(f"Final Bias: {bias}\n")

print("Verifying predictions:")
for input_vector, target_label in zip(training_data, labels):
    score = np.dot(input_vector, weights) + bias
    prediction = 1 if score > 0 else 0
    status = "Correct" if prediction == target_label else "Wrong"
    print(f"Input: {input_vector}, Target: {target_label}, Predicted: {prediction} ({status})")
```

### Output

```text
Final Weights: [0.05 0.2 ]
Final Bias: -0.5

Verifying predictions:
Input: [4. 5.], Target: 1, Predicted: 1 (Correct)
Input: [5. 4.], Target: 1, Predicted: 1 (Correct)
Input: [3.  5.5], Target: 1, Predicted: 1 (Correct)
Input: [2. 1.], Target: 0, Predicted: 0 (Correct)
Input: [3.  0.5], Target: 0, Predicted: 0 (Correct)
Input: [1. 2.], Target: 0, Predicted: 0 (Correct)
```

## Maths Notations

We define the **Error** ($e$) as the difference between the Target ($y$) and the Prediction ($\hat{ y }$):
$$
e = y - \hat{ y }
$$

The update rule for the weights ($w$) and bias ($b$) given an **Input** ($x$) and **Learning Rate** ($\eta$) is:

$$
w \leftarrow w + \eta \cdot e \cdot x
$$
$$
b \leftarrow b + \eta \cdot e
$$
