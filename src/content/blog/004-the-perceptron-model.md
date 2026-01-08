The **Perceptron** builds upon the [weighted sum](/post/weighted-sum) operation and serves as the core building block of **Neural Networks**. For problems that are **linearly separable**, the Perceptron allows us to move from calculating scores with the weighted sum to making binary **decisions**:

- Should I watch this movie? (Yes / No)
- Is this email spam? (Yes / No)
- Is this image a cat? (Yes / No)

A Perceptron is built from two components:

1.  **Weighted Sum**: Aggregates the inputs.
2.  **Activation Function**: Applies a rule to the weighted sum to determine the output.

In the original Perceptron, the activation function is a simple **Step Function**:
- If the Weighted Sum > Threshold $\rightarrow$ Output 1
- If the Weighted Sum $\leq$ Threshold $\rightarrow$ Output 0

Visually, the Perceptron works by drawing a straight line (a **Decision Boundary**) to separate the data:
- **The Weight Vector ($\vec{w}$)**: Weighted sum weights - determines the angle or rotation of the line. 
- **The Bias ($b$)**: Shifts the line away from the origin.

The following interactive chart allows you to play with these components:
- **Your Goal**: Move the boundary so that all "Spam" points are above it and all "Not Spam" points are below it.
- **Feedback**: Points turn <span style="color:green; font-weight:bold;">Green</span> when correctly classified and <span style="color:red; font-weight:bold;">Red</span> when mistakes are made - the weighted sum value is shown for each point.

```graph
perceptron-classification
```

# Interpretation

Revisiting our movie recommendation theme. To calculate movie compatibility scores for Mike, we assign weights to his preferences: he loves Action (Weight: <span style="color:#0000FF; font-weight:bold;">5</span>) but is not too keen about Comedy (Weight: <span style="color:#800080; font-weight:bold;">1</span>):

**Movie A:** 
  * Features: High Action (<span style="color:#E74C3C; font-weight:bold;">30</span>), Mid Comedy (<span style="color:#27AE60; font-weight:bold;">45</span>).
  * Weighted Sum: $(\textcolor{#E74C3C}{30} \times \textcolor{#0000FF}{5}) + (\textcolor{#27AE60}{45} \times \textcolor{#800080}{1}) = 195$

**Movie B:** 
  * Features: Low Action (<span style="color:#E74C3C; font-weight:bold;">10</span>), High Comedy (<span style="color:#27AE60; font-weight:bold;">55</span>).
  * Weighted Sum: $(\textcolor{#E74C3C}{10} \times \textcolor{#0000FF}{5}) + (\textcolor{#27AE60}{55} \times \textcolor{#800080}{1}) = 105$ 

Mike needs a **Yes / No** decision. Let's set his threshold to **150**:
  * **Movie A:** Watch 
  * **Movie B:** Skip

**The Standardization Trick**: Computers process data faster when comparing numbers to **0**. Instead of asking *"Is score > 150?"*, we shift the starting line back by 150. This shift is the Bias (-150).
  * **Old Rule:** Reach 150.
  * **New Rule:** Start at (-150), then reach **0**.

Both methods give the exact same result, but the **Bias** method allows every neuron to use the same universal check: **Is the result positive?**. To make the math elegant, we treat the Bias as just another weight. We add an invisible input feature with its value set to **1**, its corresponding weight is the bias weight. 

**Movie A:** 
  * Features: High Action (<span style="color:#E74C3C; font-weight:bold;">30</span>), Mid Comedy (<span style="color:#27AE60; font-weight:bold;">45</span>), Bias Feature (<span style="color:#3498DB; font-weight:bold;">1</span>)
  * Weighted Sum: $(\textcolor{#E74C3C}{30} \times \textcolor{#0000FF}{5}) + (\textcolor{#27AE60}{45} \times \textcolor{#800080}{1}) + (\textcolor{#3498DB}{1} \times -150) = 45$
  * Decision: $(45 > 0) \rightarrow 1$ (Yes)

**Movie B:** 
  * Features: Low Action (<span style="color:#E74C3C; font-weight:bold;">10</span>), High Comedy (<span style="color:#27AE60; font-weight:bold;">55</span>), Bias Feature (<span style="color:#3498DB; font-weight:bold;">1</span>)
  * Weighted Sum: $(\textcolor{#E74C3C}{10} \times \textcolor{#0000FF}{5}) + (\textcolor{#27AE60}{55} \times \textcolor{#800080}{1}) + (\textcolor{#3498DB}{1} \times -150) = -45$
  * Decision: $(-45 \leq 0) \rightarrow 0$ (No)

We have now converted a complex decision into a single, unified formula.

## Code

Here is how we can implement a simple Perceptron in Python to make that movie decision:

```python
import numpy as np

def perceptron_step_function(z):
    if z > 0:
        return 1 # Yes (Watch)
    else:
        return 0 # No (Skip)

# Movie preferences
w_action = 5
w_comedy = 1

# We treat the bias as a weight
w_bias = -150 

# The bias "invisible input" is always 1
bias_input = 1

# Compile the Weight Vector: [Action, Comedy, Bias]
weights = np.array([w_action, w_comedy, w_bias])

# Movie A: High Action (30), Mid Comedy (45)
movie_a = np.array([30, 45, bias_input])

# Movie B: Low Action (10), High Comedy (55)
movie_b = np.array([10, 55, bias_input])

score_a = np.dot(movie_a, weights)
decision_a = perceptron_step_function(score_a)

print(f"Movie A Score: {score_a}")
print(f"Decision: {decision_a} (Yes)\n")

score_b = np.dot(movie_b, weights)
decision_b = perceptron_step_function(score_b)

print(f"Movie B Score: {score_b}")
print(f"Decision: {decision_b} (No)")
```

```text
Output
Movie A Score: 45
Decision: 1 (Yes)

Movie B Score: -45
Decision: 0 (No)
```

## Maths Notations

The Perceptron mathematics introduces one small but crucial change. Instead of just $w \cdot x$, we often include a **bias** term ($b$) and pass the result through an activation function ($\phi$).

The weighted sum with bias:
$$
z = w \cdot x + b
$$

**Note:** In our code, we performed the "Standardization Trick," effectively combining $w$ and $b$ into a single vector operation.

The activation(Step Function):
$$
y = \begin{cases} 1 & \text{ if } z > 0 \\ 0 & \text{ if } z \leq 0 \end{cases}
$$
