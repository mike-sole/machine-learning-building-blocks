---
title: "Matrix Multiplication"
date: "2024-04-21"
image: "/assets/images/weighted-sum.svg"
---

Matrix multiplication builds upon the [weighted sum](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html) operation which was explored in the [previous blog post](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html).

Matrix multiplication can be described as a collection of weighted sums. 

Here is a matrix multiplication between a vector $({\color{red} 1}, {\color{red} 4}, {\color{red}{10}})$ and a matrix $\begin{bmatrix}10 & 1 \\ 5 & 1 \\ 3 & 1\end{bmatrix}$:

$$\begin{bmatrix}(1 * \textcolor{blue}{10}) + (4 * 5) + (10 * 3) & (1 * 1) + (4 * 1) + (10 * 1) \end{bmatrix} = \begin{bmatrix}60 & 18 \end{bmatrix}$$ 

You can see two weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the vector and the **first column of the matrix**
2. **Weighted sum** between the vector and the **second column of the matrix**

Here is a matrix multiplication between a matrix $\begin{bmatrix}1 & 4 & 10 \\ 5 &  1 & 3 \end{bmatrix}$ and a matrix $\begin{bmatrix}10 & 1 \\ 5 & 1 \\ 3 & 1\end{bmatrix}$:

$$\begin{bmatrix}(1 * 10) + (4 * 5) + (10 * 3) & (1 * 1) + (4 * 1) + (10 * 1) \\ (5 * 10) + (1 * 5) + (3 * 3) & (5 * 1) + (1 * 1) + (3 * 1)\end{bmatrix} = \begin{bmatrix}60 & 18 \\ xxx & yyy \end{bmatrix}$$ 

You can see four weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the **first row of the first matrix** and the **first column of the second matrix**
2. **Weighted sum** between the **first row of the first matrix** and the **second column of the second matrix**
3. **Weighted sum** between the **second row of the first matrix** and the **first column of the second matrix**
5. **Weighted sum** between the **second row of the first matrix** and the **second column of the second matrix**





# Interpretation



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

weights = np.array([[1, 2], 
                    [4, 1], 
                    [10, 1]])

numbers = np.array([[10, 5, 3],
                     [1, 1, 1]])

print(numbers)
print(weights)

weighted_sum = np.matmul(numbers, weights)

print('Weighted sum is: ', weighted_sum)
```

    [[10  5  3]
     [ 1  1  1]]
    [[ 1  2]
     [ 4  1]
     [10  1]]
    Weighted sum is:  [[60 28]
     [15  4]]


## Maths Notations

Linear algebra defines the weighted sum as the dot product operation. The following notation is used to represent the dot product between $a$ and $b$

$$
  a \cdot b
$$

Here is an example of the dot product applied to the vectors $(10 + 5 + 3)$ and $(1, 4, 10)$:

$$
  (10 + 5 + 3) \cdot (1, 4, 10) = 60
$$

A subsequent matrix multiplication post will cover the $a^\mathsf{T}b$ dot production notation. 
