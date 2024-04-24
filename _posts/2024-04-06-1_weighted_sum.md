---
title: "Weighted Sum"
date: "2024-04-06"
image: "/assets/images/weighted-sum.svg"
---

At the heart of machine learning, data science, signal processing and beyond lies the **weighted sum**.  

Here is a normal sum: $10 + 5 + 3 = 18$

Here is a weighted sum for $10 + 5 + 3$ given weights $(1, 4, 10)$:

$$(10 * 1) + (5 * 4) + (3 * 10) = 10 + 20 + 30 = 60$$

Before adding numbers together, each number is scaled with respect to its corresponding weight. As a result, weights control the overall contribution of each number.

# Interpretation

The weighted sum can be used to determine the similarity between lists of numbers (vectors). As an example, Mike rated his movie category preferences as follows:
- Action: 10 / 10
- Sci-fi: 5 / 10
- Comedy: 7 / 10

These ratings can be represented as weights $(10, 5, 7)$. 

Mike wanted to find a movie to watch, he has the choice between movie A and movie B which have the following categorisations: 
- Movie A (action: 10 / 10, sci-fi: 5 / 10, comedy: 10 / 10)
- Movie B (action: 1 / 10, sci-fi: 5 / 10, comedy: 10 / 10)

Weighted sum for movie A:

$$(10 * 10) + (5 * 5) + (10 * 7) = 100 + 25 + 70 = 195$$

Weighted sum for movie B:

$$(1 * 10) + (5 * 5) + (10 * 7) = 10 + 25 + 70 = 105$$

The movie with the highest weighted sum is movie A with 195, therefore it has a higher similarity with Mike's preferences.

## Code

Weighted sum without using a library:


```python
numbers = [10, 5, 3]
weights = [1, 4, 10]

weighted_sum = 0
for index in range(len(numbers)):
    weighted_sum += numbers[index] * weights[index]

print('Weighted sum is: ', weighted_sum)
```

    Weighted sum is:  60


Weighted sum using the NumPy library:


```python
import numpy as np

numbers = np.array([10, 5, 3])
weights = np.array([1, 4, 10])

weighted_sum = np.dot(numbers, weights)

print('Weighted sum is: ', weighted_sum)
```

    Weighted sum is:  60


## Maths Notations

Linear algebra defines the weighted sum as the dot product operation. The following notation is used to represent the dot product between $a$ and $b$

$$
  a \cdot b
$$

Here is an example of the dot product applied to the vectors $(10 + 5 + 3)$ and $(1, 4, 10)$:

$$
  (10 + 5 + 3) \cdot (1, 4, 10) = 60
$$

