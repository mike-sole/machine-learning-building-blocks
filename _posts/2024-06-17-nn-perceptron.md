---
title: "Neural Networks: Perceptron"
date: "2024-06-17"
image: "/assets/images/vector-similarity-measures.svg"
---





Neural Networks ... The perceptron ... 

Train / predict 

The perceptron 

A previous blog post introduced the [weighted sum](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html) (also known as the **dot product**)

<div id="html" markdown="0">

  <div id="perceptron-chart" class="perceptron-chart" style="width: 75%; aspect-ratio : 1 / 1;"></div>

  <script>

    {% include nn-perceptron/perceptron.js %}

    const perceptronChart = new PerceptronChart('perceptron-chart');
        
  </script>
  <br>
</div>

<div id="html" markdown="0">

  <div id="perceptron-decision-boundary" class="perceptron-decision-boundary" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>
    {% include vector-similarity-measures/utils.js %}

    {% include nn-perceptron/nn_decision_boundaries_chart.js %}

    new Chart("perceptron-decision-boundary");
  </script>
  <br>
</div>


# Interpretation

## Code

Without using a library:


```python

```

Using the NumPy and SciPy libraries:


```python

```

## Maths Notations





## References 

[JSXGraph](https://jsxgraph.uni-bayreuth.de/wp/index.html) was used to create the graphs in this blog post. The examples that come with this library are excellent, this blog post heavily extended the sine and cosine example which can be found [here](https://jsxgraph.uni-bayreuth.de/wiki/index.php/Sine_and_cosine).

Google has some great material on the topic of vector similarity measures [here](https://developers.google.com/machine-learning/clustering/similarity/measuring-similarity) and [here](https://cloud.google.com/spanner/docs/choose-vector-distance-function) - this blog post covers the core topics from this material. 


