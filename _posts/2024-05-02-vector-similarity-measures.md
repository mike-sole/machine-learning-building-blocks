---
title: "Vector Similarity Measures"
date: "2024-05-02"
image: "/assets/images/vector-similarity-measures.svg"
---

Vector similarity measures are a key Machine Learning building block. In this context, a vector encodes properties (features) of an entity, known as a **feature vector**. 

A vector represents a point (coordinate) in space along with a magnitude (length) and direction. These properties are illustrated in the following interactive graph where:
* $\vec{a}$ and $\vec{b}$ are vectors
  * $\vec{a}$ and $\vec{b}$ start at the origin and end at the arrow tip where the vector coordinate point can be found (the interactive chart allows the point to be dragged around)
  * Vector magnitude (length) is shown by the intersecting labels
* Angle between the directions of $\vec{a}$ and $\vec{b}$
* Distance between $\vec{a}$ and $\vec{b}$ coordinates is shown by the dashed line

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

Vector similarity measures take one or more vector properties (coordinate, magnitude, direction) into consideration. Three common similarity measures are defined as:  

* Distance between vector points (coordinates)
  * Known as the **Euclidean distance** 
* Difference between vector directions
  * Calculated using the cosine of the angle between two vectors. The cosine function returns the value of 1 when two vectors point in the same direction and -1 when two vectors point in the opposite direction. Therefore the cosine function maps both 0 - 180 degrees and 360 - 180 degrees to the range of 1 to -1. 
  * Known as the **Cosine similarity** 
* Difference between vector directions combined with magnitudes (lengths)
  * Extends **Cosine similarity** by multiplying it with vector magnitudes (lengths)
  * Known as the **Dot Product similarity**  

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
  * Note that when vectors are normalised (their magnitude / length are scaled to equal 1), then the **dot product** represents the cosine between two vectors (resulting in the **Cosine similarity** measure) e.g: 
    * **Cosine similarity** = 1 * 1 * (cosine of angle between vector $\vec{a}$ and $\vec{b}$)

The following interactive chart allows both dot product calculations to be inspected:

<div id="html" markdown="0">

  <div id="jxgbox-basic-multi" class="jxgbox-basic-multi" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>
    new Chart("jxgbox-basic-multi", SIMPLE_LBL_BASIC_MULTI_DOT_PRODUCT_REPRESENTATIONS);
  </script>
  <br>
</div>

# Interpretation

Geometric interpretations of the three vector similarity measures will be presented in this section. 

Given feature vector A and B ... 

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

    {% include vector-similarity-measures/unit_circle_charts.js %}

    new UnitCircleChart('test');
  </script>
  <br>
</div>



## Code

Without using a library:


```python
# helper functions



```

Using the NumPy library:


```python

```

## Maths Notations


