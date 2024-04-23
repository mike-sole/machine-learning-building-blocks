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

Matrix multiplication is a collection of weighted sums. A weighted sum is calculated between each row of one matrix and each column of another matrix. The output is a matrix of these of weighted sums as illustrated by the blog post header image. 

Following the movie recommendation example introduced in the interpretation section of the [previous weighted sum blog post](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html). Movies and their categorisations can be represented as one matrix and user preferences can be represented as another matrix: 

As an example, Mike and Sienna rated their movie category preferences as follows:
- <span style="color: red;">Mike</span>: (action: 9 / 10, sci-fi: 5 / 10, comedy: 2 / 10)
- <span style="color: purple;">Sienna</span>: (action: 1 / 10, sci-fi: 6 / 10, comedy: 10 / 10)

Mike and Sienna want movie recommendations, there is a library of movies A, B and C with the  following categorisations: 
- <span style="color: green;">Movie A</span> (action: 10 / 10, sci-fi: 5 / 10, comedy: 0 / 10)
- <span style="color: blue;">Movie B</span> (action: 2 / 10, sci-fi: 5 / 10, comedy: 10 / 10)
- <span style="color: orange;">Movie C</span> (action: 2 / 10, sci-fi: 7 / 10, comedy: 1 / 10)

A user preference matrix is defined as:

$$\begin{bmatrix}{\color{red}{9}} & {\color{red}{5}} & {\color{red}{2}} \\ {\color{purple}{1}} & {\color{purple}{6}} & {\color{purple}{10}} \end{bmatrix}$$ 

A movie categorisation matrix is defined as:

$$\begin{bmatrix}
{\color{green}{10}} & {\color{blue}{2}} & {\color{orange}{2}} \\ 
{\color{green}{5}} & {\color{blue}{5}} & {\color{orange}{7}} \\
 {\color{green}{0}} & {\color{blue}{10}} & {\color{orange}{1}}
 \end{bmatrix}$$

Multiplying the user preference matrix with the movie categorisation matrix give us:

$$\begin{bmatrix}
115 & 63 & 55 \\ 
40 & 132 & 54
 \end{bmatrix}$$ 

Adding row and column labels help with interpreting the movie rating results. We can see that the most recommended film for Mike is Movie A and the most recommended movie for Sienna is movie B:

|        | Movie A | Movie B | Movie C |
|--------|---------|---------|---------|
| Mike   | 115     | 63      | 55      |
| Sienna | 40      | 132     | 54      |



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
