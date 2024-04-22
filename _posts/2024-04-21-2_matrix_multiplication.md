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
\begin{bmatrix}60 & 15 \\ 64 & 9 
\end{bmatrix}$$ 

You can see four weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the **<span style="color: red;">first row of the first matrix</span>** and the **<span style="color: green;">first column of the second matrix</span>**
2. **Weighted sum** between the **<span style="color: red;">first row of the first matrix</span>** and the **<span style="color: blue;">second column of the second matrix</span>**
3. **Weighted sum** between the **<span style="color: purple;">second row of the first matrix</span>** and the **<span style="color: green;">first column of the second matrix</span>**
5. **Weighted sum** between the **<span style="color: purple;">second row of the first matrix</span>** and the **<span style="color: blue;">second column of the second matrix</span>**





# Interpretation



## Code

Matrix multiplication without using a library:


```python
# helper functions

def weighted_sum(array_1, array_2):
    return sum([array_1[idx] * array_2[idx] for idx in range(len(array_1))])

def get_column_from_matrix(matrix, column_index):
    return [row[column_index] for row in matrix]

def get_columns_from_matrix(matrix):
    num_columns = len(matrix[0])
    return [get_column_from_matrix(matrix, column_index) for column_index in range(num_columns)]

def print_matrix(matrix):
    print('\n'.join([str(row) for row in matrix]))


matrix_1 = [[1., 4., 10.],
            [5., 1., 3.]]

matrix_2 = [[10., 1.], 
            [5.,  1.], 
            [3.,  1.]]

matrix_2_columns = get_columns_from_matrix(matrix_2)

matrix_product = []
for matrix_1_row in matrix_1:
    matrix_product_row = []
    for matrix_2_column in matrix_2_columns:
        matrix_product_row.append(weighted_sum(matrix_1_row, matrix_2_column))
    matrix_product.append(matrix_product_row)


print('matrix 1:')
print_matrix(matrix_1)
print('')

print('matrix 2:')
print_matrix(matrix_2)
print('')

print('matrix 1 multiplied by matrix 2:')
print_matrix(matrix_product)
```

    matrix 1:
    [1.0, 4.0, 10.0]
    [5.0, 1.0, 3.0]
    
    matrix 2:
    [10.0, 1.0]
    [5.0, 1.0]
    [3.0, 1.0]
    
    matrix 1 multiplied by matrix 2:
    [60.0, 15.0]
    [64.0, 9.0]


Matrix multiplication using the NumPy library:


```python
import numpy as np

matrix_1 = np.array([[1., 4., 10.],
                     [5., 1., 3.]])

matrix_2 = np.array([[10., 1.], 
                     [5.,  1.], 
                     [3.,  1.]])

matrix_product = np.matmul(matrix_1, matrix_2)

print('matrix 1:')
print(matrix_1)
print('')

print('matrix 2:')
print(matrix_2)
print('')

print('matrix 1 multiplied by matrix 2:')
print(matrix_product)

# other ways to achieve matrix multiplication with NumPy
assert np.array_equal(matrix_product, np.dot(matrix_1, matrix_2))
assert np.array_equal(matrix_product, matrix_1 @ matrix_2)
```

    matrix 1:
    [[ 1.  4. 10.]
     [ 5.  1.  3.]]
    
    matrix 2:
    [[10.  1.]
     [ 5.  1.]
     [ 3.  1.]]
    
    matrix 1 multiplied by matrix 2:
    [[60. 15.]
     [64.  9.]]


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
