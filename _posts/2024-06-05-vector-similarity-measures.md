---
title: "DRAFT: Vector Similarity Measures"
date: "2024-06-05"
image: "/assets/images/vector-similarity-measures.svg"
---

Vector similarity measures are a key Machine Learning building block. In this context, a vector encodes properties (features) of an entity, known as a **feature vector**. 

A vector represents a point (coordinate) in space relative to another point in space. As a result, a vector has both **magnitude (length)** and **direction**  properties. These properties are illustrated in the following interactive graph for two vectors along with intuitive measures between the vectors:
* $\vec{a}$ and $\vec{b}$ are vectors
  * $\vec{a}$ and $\vec{b}$ both start at the origin (they are relative to the origin) and end at the arrow tip where the vector coordinate point can be found (the interactive chart allows the points to be dragged around)
  * Vector magnitude (length) is shown by the intersecting labels
* Intuitive measures between $\vec{a}$ and $\vec{b}$
  * Distance between $\vec{a}$ and $\vec{b}$ coordinates is shown by the dashed line
  * Angle between the directions of $\vec{a}$ and $\vec{b}$


<div id="html" markdown="0">

  <div id="jxgbox-basic" class="jxgbox-basic" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <style>
    {% include vector-similarity-measures/styles.css %}
  </style>

  <script>
    {% include vector-similarity-measures/utils.js %}

    {% include vector-similarity-measures/basic.js %}

    new Chart("jxgbox-basic");
  </script>
  <br>
</div>

Vector similarity measures take one or more vector properties into consideration. Three common similarity measures are defined as:  

* Distance between vector points (coordinates)
  * Known as the **Euclidean Distance** 
* Difference between vector directions
  * Known as the **Cosine Similarity** 
  * Calculated using the cosine of the angle between two vectors. The cosine function returns the value of 1 when two vectors point in the same direction and -1 when two vectors point in the opposite direction. The following graph visualises this function:

<div id="html" markdown="0">

  <div id="cosineGraph" class="cosineGraph" style="margin-left: auto;
  margin-right: auto; width: 50%; aspect-ratio : 1 / 1;"></div>
  
  <script>

    {% include vector-similarity-measures/unit_circle_charts.js %}

    new AngleDegreesMetricsGraph('cosineGraph').withCosineSimilarityMeasure(false);
  </script>
  <br>
</div>

* Difference between vector directions combined with magnitudes (lengths)
  * Known as the **Dot Product Similarity**
  * Extends **Cosine Similarity** by multiplying it with vector magnitudes (lengths)

Each vector similarity measure described above is illustrated by the following interactive chart:

<div id="html" markdown="0">

  <div id="jxgbox-basic-with-metrics" class="jxgbox-basic-with-metrics" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>
    new Chart("jxgbox-basic-with-metrics", SIMPLE_LBL_BASIC);
  </script>
  <br>
</div>

A previous blog post introduced the [weighted sum](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html) (also known as the **dot product**) using the algebraic representation of multiplying corresponding elements between vectors before adding them together. We have just seen the geometric representation of the **dot product** as opposed to the algebraic representation:
* Algebraic representation: 
  * $\vec{a} \cdot \vec{b}$ = $\vec{a}_0 * \vec{b}_0 + \vec{a}_1 * \vec{b}_1 + ... + \vec{a}_n * \vec{b}_n$
* Geometric representation: 
  * $\vec{a} \cdot \vec{b}$ = (length of vector $\vec{a}$) * (length of vector $\vec{b}$) * (cosine of angle between vector $\vec{a}$ and $\vec{b}$)

The following interactive chart allows both dot product calculations to be inspected (drag the vector coordinates around):

<div id="html" markdown="0">

  <div id="jxgbox-basic-multi" class="jxgbox-basic-multi" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>
    new Chart("jxgbox-basic-multi", SIMPLE_LBL_BASIC_MULTI_DOT_PRODUCT_REPRESENTATIONS);
  </script>
  <br>
</div>




 When vectors are **normalised** - their magnitude (length) is scaled to equal 1 -  then the **dot product** represents the cosine between two vectors (resulting in the **Cosine Similarity** measure) e.g: 
  * **Dot product** = (length of vector $\vec{a}$) * (length of vector $\vec{b}$) * (cosine of angle between vector $\vec{a}$ and $\vec{b}$)
  * **Cosine Similarity** with normalised vectors = 1 * 1 * (cosine of angle between vector $\vec{a}$ and $\vec{b}$)

The following interactive chart allows the cosine to be inspected between two normalised vectors:
  * The dashed circle has a radius of 1, because normalised vectors have a magnitude (length) of 1
  * Vector $\vec{b}$ has a fixed position at coordinate $(1, 0)$,  vector $\vec{a}$ can be dragged around the circle to see the corresponding cosine value between the two vectors

<div id="html" markdown="0">

  <div style="width: 100%; display: table;">
      <div style="display: table-row">
          <div style="width: 50%; display: table-cell;"> 
            <div id="testUnitCircle" class="testUnitCircle" style="width: 100%; aspect-ratio : 1 / 1;"></div>
          </div>
          <div style="width: 50% display: table-cell;">
            <div id="testMetrics" class="testMetrics" style="width: 100%; aspect-ratio : 1 / 1;"></div>
          </div>
      </div>
  </div>

  <script>
    new UnitCircleChart('test')
          .withCosineSimilarityMeasure(false);
  </script>
  <br>
</div>

Subtracting the **Cosine Similarity** from 1 results in a distance measure (**Cosine Distance**) as shown by the following interactive chart:

<div id="html" markdown="0">

  <div style="width: 100%; display: table;">
      <div style="display: table-row">
          <div style="width: 50%; display: table-cell;"> 
            <div id="cosineSimilarityInvertedUnitCircle" class="cosineSimilarityInvertedUnitCircle" style="width: 100%; aspect-ratio : 1 / 1;"></div>
          </div>
          <div style="width: 50% display: table-cell;">
            <div id="cosineSimilarityInvertedMetrics" class="cosineSimilarityInvertedMetrics" style="width: 100%; aspect-ratio : 1 / 1;"></div>
          </div>
      </div>
  </div>

  <script>
    new UnitCircleChart('cosineSimilarityInverted')
          .withCosineSimilarityMeasure(true);
  </script>
  <br>
</div>

The following chart allows us to compare the **Cosine Distance** against the **Euclidean distance** for **normliased vectors**:

<div id="html" markdown="0">

  <div style="width: 100%; display: table;">
      <div style="display: table-row">
          <div style="width: 50%; display: table-cell;"> 
            <div id="cosineAndEuclideanUnitCircle" class="cosineAndEuclideanUnitCircle" style="width: 100%; aspect-ratio : 1 / 1;"></div>
          </div>
          <div style="width: 50% display: table-cell;">
            <div id="cosineAndEuclideanMetrics" class="cosineAndEuclideanMetrics" style="width: 100%; aspect-ratio : 1 / 1;"></div>
          </div>
      </div>
  </div>

  <script>
    new UnitCircleChart('cosineAndEuclidean')
          .withCosineSimilarityMeasure(true)
          .withEuclideanDistanceMetric();
  </script>
  <br>
</div>

# Interpretation

Continuing with the theme of movie recommendation examples from previous blog posts. Say that Movie A, B and C have the following **normalised** categorisations: 
- Movie A (action: 0.98, comedy: 0.20)
- Movie B (action: 0.71, comedy: 0.71)
- Movie C (action: 0.16, comedy: 0.99)

Categorisation values are **normalised** for each movie. E.g. the categorisation vector for Movie A is (0.98, 0.20) which has a magnitude (length) of 1. The following chart visualises the movie vectors, where vectors for Movie A, B and C are $\vec{a}$, $\vec{b}$ and $\vec{c}$ respectively. The dashed circle has a radius of 1, because normalised vectors have a magnitude (length) of 1.

<div id="html" markdown="0">

  <div id="jxgbox-interpretationUnitCircle" class="jxgbox-interpretationUnitCircle" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>

    {% include vector-similarity-measures/interpretation.js %}

    const coordsA = [5, 1];
    const coordsB = [9, 9];
    const coordsC = [.5, 3.];

    new InterpretationUnitCircle("jxgbox-interpretationUnitCircle", coordsA, coordsB, coordsC);

  </script>
  <br>
</div>

As the movie vectors are **normalised**, we know that:
  * **Dot Product Similarity** is equal to the **Cosine Similarity** 
  * **Euclidean Distance** orders vectors by distance the same way as the **Cosine Distance** orders vectors by distance

Similarity measures between each movie can be shown by a pairwise distance matrix. The following table shows a pairwise distance matrix using the **Euclidean Distance**. E.g. the top left cell corresponds to the distance between Movie A and Movie A which is 0. Furthermote, the top right cell corresponds to the distqnce between Movie A and Movie C which is 1.14.  





|           | Movie A | Movie B | Movie C |
|-----------|--------:|--------:|--------:|
| **Movie A**   | 0.00 | 0.58 | 1.14 |
| **Movie B**   | 0.58 | 0.00 | 0.61 |
| **Movie C**   | 1.14 | 0.61 | 0.00 |




A pairwise distance matrix using the **Cosine Distance** follows for comparison: 





|           | Movie A | Movie B | Movie C |
|-----------|--------:|--------:|--------:|
| **Movie A**   | 0.00 | 0.17 | 0.65 |
| **Movie B**   | 0.17 | 0.00 | 0.19 |
| **Movie C**   | 0.65 | 0.19 | 0.00 |




From the above, the following statements are true when using either the **Euclidean Distance** or **Cosime Distance**:
  * Movies ordered by distance from Movie A = Movie B, Movie C
  * Movies ordered by distance from Movie B = Movie A, Movie C
  * Movies ordered by distance from Movie C = Movie B, Movie A

More specifically for our movie recommendation example, we can say that if someone enjoyed Movie A, then the most similar movie to reccomend is Movie B followed by Movie C. 

The rest of this intepretation section will explore a scenario where data is **not normalised**. Extending our movie recommendation scenario, say that the movie vector magnitude (length) represents a popularity score e.g. number of likes. The following graph shows Movie vectors which have varying popularity scores, where Movie B is the most popular and Movie C is the least popular with magnitudes (lengths) of 12.73 and 3.04 respectively.  

<div id="html" markdown="0">

  <div id="jxgbox-interpretation" class="jxgbox-interpretation" style="width: 100%; aspect-ratio : 1 / 1;"></div>
  
  <script>

    new Interpretation("jxgbox-interpretation", coordsA, coordsB, coordsC);

  </script>
  <br>
</div>

Pairwise similarity tables follow for the **Euclidean Distance**, **Cosine Distance** and **Dot Product** similarity measures.

Pairwise **Euclidean Distance** between movie vectors:





|           | Movie A | Movie B | Movie C |
|-----------|--------:|--------:|--------:|
| **Movie A**   | 0.00 | 8.94 | 4.92 |
| **Movie B**   | 8.94 | 0.00 | 10.40 |
| **Movie C**   | 4.92 | 10.40 | 0.00 |




We can see that the **Euclidean Distance** scores Movies with minimum difference across all factors as more similar E.g. movies ordered by straight line distance from Movie A = Movie C, Movie B. Movie C is less popular than Movie A, however the straight line distance between Movie A and B (8.94) is far greater than the straight line distance between A and C (4.92)

Pairwise **Cosine Distance** between movie vectors:





|           | Movie A | Movie B | Movie C |
|-----------|--------:|--------:|--------:|
| **Movie A**   | 0.00 | 0.17 | 0.65 |
| **Movie B**   | 0.17 | 0.00 | 0.19 |
| **Movie C**   | 0.65 | 0.19 | 0.00 |




**Cosine Distance** normalises vectors as part of its calculation. Therefore movie popularity information is removed and does not affect this similarity measure.

Pairwise **Dot Product Similarity** between movie vectors:





|           | Movie A | Movie B | Movie C |
|-----------|--------:|--------:|--------:|
| **Movie A**   | 26.00 | 54.00 | 5.50 |
| **Movie B**   | 54.00 | 162.00 | 31.50 |
| **Movie C**   | 5.50 | 31.50 | 9.25 |




With **Dot Product Similarity**, a higher value represents a higher similarity. We can see that Movie B dominates similarity due to its high popularity value. E.g. the most similar movie to both Movie A and C is Movie B. 

As a summary, this section has interpreted vector similarity measures with respct to a simplistic movie recommendation scenario. First we worked through a **normalised** scanario and then expanded the scenario to a **non normlaised** scenario. We can see that selecting the right vector similarity measure is an important consideration. 

## Code

Without using a library:


```python
import math

def weighted_sum(array_1, array_2):
    return sum([array_1[idx] * array_2[idx] for idx in range(len(array_1))])

def magnitude(array):
    return math.sqrt(sum([x * x for x in array]))

def normalise(array):
    vector_magnitude = magnitude(array)
    return [x / vector_magnitude for x in array]

def cosine(array_1, array_2):
    return weighted_sum(normalise(array_1), normalise(array_2))

def cosine_distance(array_1, array_2):
    return 1 - cosine(array_1, array_2)

def euclidean_distance(array_1, array_2):
    diffs = [array_1[idx] - array_2[idx] for idx in range(len(array_1))]
    diffs_squared = [diff * diff for diff in diffs]
    return math.sqrt(sum(diffs_squared))


vector_a = [3.5, 1.]
vector_b = [2., 4.]

print(f'Vector a = {vector_a}')
print(f'Vector b = {vector_b}')

# vector magnitudes (lengths)
print(f'\nVector a magnitude (length) = {magnitude(vector_a):.2f}')
print(f'Vector b magnitude (length) = {magnitude(vector_b):.2f}')

# normalised vectors
print(f'\nVector a normalised = {[round(x, 2) for x in normalise(vector_a)]}')
print(f'Vector b normalised = {[round(x, 2) for x in normalise(vector_b)]}')

# similarity measures
print(f'\nDot Product between vector a and b: {weighted_sum(vector_a, vector_b):.2f}')
print(f'Cosine Distance between vector a and b: {cosine_distance(vector_a, vector_b):.2f}')
print(f'Euclidean Distance between vector a and b: {euclidean_distance(vector_a, vector_b):.2f}')

```

    Vector a = [3.5, 1.0]
    Vector b = [2.0, 4.0]
    
    Vector a magnitude (length) = 3.64
    Vector b magnitude (length) = 4.47
    
    Vector a normalised = [0.96, 0.27]
    Vector b normalised = [0.45, 0.89]
    
    Dot Product between vector a and b: 11.00
    Cosine Distance between vector a and b: 0.32
    Euclidean Distance between vector a and b: 3.35


Using the NumPy and SciPy libraries:


```python
import numpy as np
import scipy

np.set_printoptions(precision=2)

vector_a = np.array([3.5, 1.])
vector_b = np.array([2., 4.])

print(f'Vector a = {vector_a}')
print(f'Vector b = {vector_b}')

# vector magnitudes (lengths)
print(f'\nVector a magnitude (length) = {np.linalg.norm(vector_a):.2f}')
print(f'Vector b magnitude (length) = {np.linalg.norm(vector_b):.2f}')

# normalised vectors
print(f'\nVector a normalised = {vector_a / np.linalg.norm(vector_a)}')
print(f'Vector b normalised = {vector_b / np.linalg.norm(vector_b)}')

# similarity measures
print(f'\nDot Product between vector a and b: {np.dot(vector_a, vector_b):.2f}')
print(f'Cosine Distance between vector a and b: {scipy.spatial.distance.cosine(vector_a, vector_b):.2f}')
print(f'Euclidean Distance between vector a and b: {scipy.spatial.distance.euclidean(vector_a, vector_b):.2f}')

```

    Vector a = [3.5 1. ]
    Vector b = [2. 4.]
    
    Vector a magnitude (length) = 3.64
    Vector b magnitude (length) = 4.47
    
    Vector a normalised = [0.96 0.27]
    Vector b normalised = [0.45 0.89]
    
    Dot Product between vector a and b: 11.00
    Cosine Distance between vector a and b: 0.32
    Euclidean Distance between vector a and b: 3.35


## Maths Notations





<div id="html" markdown="0">

  <div id="jxgbox-maths-notation" class="jxgbox-maths-notation" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>
    new Chart("jxgbox-maths-notation", MATHS_EQUATIONS);
  </script>
  <br>
</div>

## References 
