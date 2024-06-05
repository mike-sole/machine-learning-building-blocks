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

Given feature vector A and B ... 




## Code

Without using a library:


```python
# helper functions



```

Using the NumPy library:


```python

```

## Maths Notations


