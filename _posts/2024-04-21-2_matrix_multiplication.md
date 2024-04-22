---
title: "Matrix Multiplication"
date: "2024-04-21"
image: "/assets/images/matrix-multiplication.svg"
---

Matrix multiplication builds upon the [weighted sum](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html) operation which was explored in the [previous blog post](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html).

Matrix multiplication can be described as a collection of weighted sums. 

Here is a matrix multiplication between a vector 

$$\begin{bmatrix}{\color{red}{1}} & {\color{red}{4}} & {\color{red}{10}}\end{bmatrix}$$ 

and a matrix 

$$\begin{bmatrix} {\color{green}{10}} & {\color{blue}{1}} \\ {\color{green}{5}} & {\color{blue}{1}}  \\ {\color{green}{3}} & {\color{blue}{1}} \end{bmatrix}$$

calculated as

$$
\begin{bmatrix}
    ({\color{red}{1}} * {\color{green}{10}}) + ({\color{red}{4}} * {\color{green}{5}}) + ({\color{red}{10}} * {\color{green}{3}}) & 
    
    ({\color{red}{1}} * {\color{blue}{1}}) + ({\color{red} 4} * {\color{blue}{1}}) + ({\color{red}{10}} * {\color{blue}{1}}) 
\end{bmatrix} 
= \begin{bmatrix}60 & 18 \end{bmatrix}
$$ 

You can see two weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the **<span style="color: red;">vector</span>** and the **<span style="color: green;">first column of the matrix</span>**
2. **Weighted sum** between the **<span style="color: red;">vector</span>** and the **<span style="color: blue;">second column of the matrix</span>**

Here is a matrix multiplication between a matrix 

$$\begin{bmatrix}{\color{red}{1}} & {\color{red}{4}} & {\color{red}{10}} \\ {\color{purple}{5}} & {\color{purple}{1}} & {\color{purple}{3}} \end{bmatrix}$$ 

and another matrix

$$\begin{bmatrix} {\color{green}{10}} & {\color{blue}{1}} \\ {\color{green}{5}} & {\color{blue}{1}}  \\ {\color{green}{3}} & {\color{blue}{1}} \end{bmatrix}$$

calculated as

$$\begin{bmatrix}

({\color{red}{1}} * {\color{green}{10}}) + ({\color{red}{4}} * {\color{green}{5}}) + ({\color{red}{10}} *  {\color{green}{3}}) 

& 

({\color{red}{1}} * {\color{blue}{1}}) + ({\color{red}{4}} * {\color{blue}{1}}) + ({\color{red}{10}} * {\color{blue}{1}}) 

\\ 

({\color{purple}{5}} *  {\color{green}{10}}) + ({\color{purple}{1}} *  {\color{green}{5}}) + ({\color{purple}{3}} *  {\color{green}{3}}) 

& 

( {\color{purple}{5}} * {\color{blue}{1}}) + ( {\color{purple}{1}} * {\color{blue}{1}}) + ( {\color{purple}{3}} * {\color{blue}{1}})

\end{bmatrix} 
= 
\begin{bmatrix}60 & 18 \\ xxx & yyy 
\end{bmatrix}$$ 

You can see four weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the **<span style="color: red;">first row of the first matrix</span>** and the **<span style="color: green;">first column of the second matrix</span>**
2. **Weighted sum** between the **<span style="color: red;">first row of the first matrix</span>** and the **<span style="color: blue;">second column of the second matrix</span>**
3. **Weighted sum** between the **<span style="color: purple;">second row of the first matrix</span>** and the **<span style="color: green;">first column of the second matrix</span>**
5. **Weighted sum** between the **<span style="color: purple;">second row of the first matrix</span>** and the **<span style="color: blue;">second column of the second matrix</span>**





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
