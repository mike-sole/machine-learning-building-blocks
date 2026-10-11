Matrix multiplication builds upon the [weighted sum](/post/weighted-sum) operation which was explored in the [previous blog post](/post/weighted-sum).

Matrix multiplication can be described as a collection of weighted sums.

Here is a matrix multiplication between a vector
$$
\begin{bmatrix}
\textcolor{red}{1} & \textcolor{red}{4} & \textcolor{red}{10}
\end{bmatrix}
$$
and a matrix
$$
\begin{bmatrix}
\textcolor{green}{10} & \textcolor{blue}{1} \\
\textcolor{green}{5} & \textcolor{blue}{1} \\
\textcolor{green}{3} & \textcolor{blue}{1}
\end{bmatrix}
$$
calculated as:
$$
\begin{bmatrix}
\textcolor{red}{1} & \textcolor{red}{4} & \textcolor{red}{10}
\end{bmatrix}
\cdot
\begin{bmatrix}
\textcolor{green}{10} & \textcolor{blue}{1} \\
\textcolor{green}{5} & \textcolor{blue}{1} \\
\textcolor{green}{3} & \textcolor{blue}{1}
\end{bmatrix}
=
\begin{bmatrix}
\textcolor{red}{1}*\textcolor{green}{10} + \textcolor{red}{4}*\textcolor{green}{5} + \textcolor{red}{10}*\textcolor{green}{3} &
\textcolor{red}{1}*\textcolor{blue}{1} + \textcolor{red}{4}*\textcolor{blue}{1} + \textcolor{red}{10}*\textcolor{blue}{1}
\end{bmatrix}
=
\begin{bmatrix}
60 & 15
\end{bmatrix}
$$
You can see two weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the <span style="color: rgb(255, 0, 0)">vector</span> and the <span style="color: rgb(0, 128, 0)">first column of the matrix</span>
2. **Weighted sum** between the <span style="color: rgb(255, 0, 0)">vector</span> and the <span style="color: rgb(0, 0, 255)">second column of the matrix</span>

Here is a matrix multiplication between a matrix
$$
\begin{bmatrix}
\textcolor{red}{1} & \textcolor{red}{4} & \textcolor{red}{10} \\
\textcolor{purple}{5} & \textcolor{purple}{1} & \textcolor{purple}{3}
\end{bmatrix}
$$
and another matrix
$$
\begin{bmatrix}
\textcolor{green}{10} & \textcolor{blue}{1} \\
\textcolor{green}{5} & \textcolor{blue}{1} \\
\textcolor{green}{3} & \textcolor{blue}{1}
\end{bmatrix}
$$
calculated as:
$$
\begin{bmatrix}
\textcolor{red}{1} & \textcolor{red}{4} & \textcolor{red}{10} \\
\textcolor{purple}{5} & \textcolor{purple}{1} & \textcolor{purple}{3}
\end{bmatrix}
\cdot
\begin{bmatrix}
\textcolor{green}{10} & \textcolor{blue}{1} \\
\textcolor{green}{5} & \textcolor{blue}{1} \\
\textcolor{green}{3} & \textcolor{blue}{1}
\end{bmatrix}
=
\begin{bmatrix}
\textcolor{red}{1}*\textcolor{green}{10} + \textcolor{red}{4}*\textcolor{green}{5} + \textcolor{red}{10}*\textcolor{green}{3} &
\textcolor{red}{1}*\textcolor{blue}{1} + \textcolor{red}{4}*\textcolor{blue}{1} + \textcolor{red}{10}*\textcolor{blue}{1} \\
\textcolor{purple}{5}*\textcolor{green}{10} + \textcolor{purple}{1}*\textcolor{green}{5} + \textcolor{purple}{3}*\textcolor{green}{3} &
\textcolor{purple}{5}*\textcolor{blue}{1} + \textcolor{purple}{1}*\textcolor{blue}{1} + \textcolor{purple}{3}*\textcolor{blue}{1}
\end{bmatrix}
=
\begin{bmatrix}
60 & 15 \\
64 & 9
\end{bmatrix}
$$
You can see four weighted sums have been calculated to achieve this matrix multiplication operation:
1. **Weighted sum** between the <span style="color: rgb(255, 0, 0)">first row of the first matrix</span> and the <span style="color: rgb(0, 128, 0)">first column of the second matrix</span>
2. **Weighted sum** between the <span style="color: rgb(255, 0, 0)">first row of the first matrix</span> and the <span style="color: rgb(0, 0, 255)">second column of the second matrix</span>
3. **Weighted sum** between the <span style="color: rgb(128, 0, 128)">second row of the first matrix</span> and the <span style="color: rgb(0, 128, 0)">first column of the second matrix</span>
4. **Weighted sum** between the <span style="color: rgb(128, 0, 128)">second row of the first matrix</span> and the <span style="color: rgb(0, 0, 255)">second column of the second matrix</span>

Since matrix multiplication calculates the weighted sum between every row of the first matrix with every column of the second matrix, for a valid matrix multiplication, the number of columns in the first matrix must be equal to the number of rows in the second matrix.

# Interpretation

Matrix multiplication is a collection of weighted sums. A weighted sum is calculated between each row of the first matrix and each column of the second matrix. The output is a matrix of the weighted sums as illustrated by the blog post header image.

Following the movie recommendation example introduced in the interpretation section of the [previous weighted sum blog post](/post/weighted-sum). Movies and their categorisations can be represented as one matrix and user preferences can be represented as another matrix:

As an example, Mike and Sienna rated their movie category preferences as follows:
- <span style="color: rgb(255, 0, 0)">Mike</span>: (action: 9 / 10, sci-fi: 5 / 10, comedy: 2 / 10)
- <span style="color: rgb(128, 0, 128)">Sienna</span>: (action: 1 / 10, sci-fi: 6 / 10, comedy: 10 / 10)

Mike and Sienna want some movie recommendations from a library of movies which contains movies A, B and C with the following categorisations:
- <span style="color: rgb(0, 128, 0)">Movie A</span> (action: 10 / 10, sci-fi: 5 / 10, comedy: 0 / 10)
- <span style="color: rgb(0, 0, 255)">Movie B</span> (action: 2 / 10, sci-fi: 5 / 10, comedy: 10 / 10)
- <span style="color: rgb(255, 165, 0)">Movie C</span> (action: 2 / 10, sci-fi: 7 / 10, comedy: 1 / 10)

A user preference matrix is defined as:

$$
\begin{bmatrix}
\textcolor{red}{9} & \textcolor{red}{5} & \textcolor{red}{2} \\
\textcolor{purple}{1} & \textcolor{purple}{6} & \textcolor{purple}{10}
\end{bmatrix}
$$
A movie categorisation matrix is defined as:

$$
\begin{bmatrix}
\textcolor{green}{10} & \textcolor{blue}{2} & \textcolor{orange}{2} \\
\textcolor{green}{5} & \textcolor{blue}{5} & \textcolor{orange}{7} \\
\textcolor{green}{0} & \textcolor{blue}{10} & \textcolor{orange}{1}
\end{bmatrix}
$$
Multiplying the user preference matrix with the movie categorisation matrix give us:

$$
\begin{bmatrix}
115 & 63 & 55 \\
40 & 132 & 54
\end{bmatrix}
$$
Adding row and column labels help with interpreting the movie rating results. We can see that the most recommended movie for Mike is Movie A and the most recommended movie for Sienna is movie B:

| | Movie A | Movie B | Movie C |
| --- | --- | --- | --- |
| **Mike** | 115 | 63 | 55 |
| **Sienna** | 40 | 132 | 54 |

## Code
Matrix multiplication without using a library:

```python
# helper functions
def weighted_sum(array_1, array_2):
    return sum([array_1[idx] * array_2[idx] for idx in range(len(array_1))])

def get_column_from_matrix(matrix, column_index):
    return [row[column_index] for row in matrix]

def get_all_columns_from_matrix(matrix):
    num_columns = len(matrix[0])
    return [get_column_from_matrix(matrix, column_index) for column_index in range(num_columns)]

def print_matrix(matrix):
    print('\n'.join([str(row) for row in matrix]))

matrix_1 = [[1., 4., 10.], [5., 1., 3.]]
matrix_2 = [[10., 1.], [5., 1.], [3., 1.]]
matrix_2_columns = get_all_columns_from_matrix(matrix_2)

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

```text
Output
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
```

Matrix multiplication using the NumPy library:

```python
import numpy as np

matrix_1 = np.array([[1., 4., 10.], [5., 1., 3.]])
matrix_2 = np.array([[10., 1.], [5., 1.], [3., 1.]])

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

```text
Output
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
```

## Maths Notations

Linear algebra defines matrix multiplication as the dot product operation. The following notation is used to represent the dot product between $A$ and $B$:
$$
A \cdot B
$$

Alternatively the following notation can be used to represent matrix multiplication:
$$
AB
$$

For a valid matrix multiplication, we previously highlighted that the number of columns in the first matrix must be equal to the number of rows in the second matrix. To satisfy this, sometimes the transpose of a matrix might need to be applied, it is common to see the following notation which transposes matrix $A$ before multiplying it with matrix $B$:
$$
A^{T}B
$$
