---
title: "Neural Networks: Perceptron (model)"
date: "2024-06-17"
image: "/assets/images/perceptron-decision-boundary.svg"
---





The perceptron is a foundational learning algorithm and the elementary building block of neural networks. Grasping its function is crucial for understanding how modern deep learning models work, which achieve state-of-the-art performance in fields like natural language processing and computer vision.

Key properties of the perceptron:
* **Classifier**: It produces a categorical output, predicting a class label like 'spam' or 'not spam'.

* **Linear**: The model's decision boundary is a straight line, which means it can only separate data that is linearly separable.

* **Supervised**: It learns from a labeled dataset, where the correct output for each input is provided during training.

* **Weighted Sum**: 

  * The perceptron mdoel is a weighted sum followed by a threshold, a previous blog post introduced the [weighted sum](https://mike-sole.github.io/machine-learning-building-blocks/2024/04/06/weighted-sum.html)

A perceptron is represented by a vector. This vector is called a weight vector. 
* During training, weights are learnt to separate data into two classes 
* During inference, the weighted sum is calculated between the weight vector and an input vector followed by a threshold to assign a class label 

This blog post focuses on the perceptron model and inference, a following blog post will focus on training the model. 

The weighted sum (dot product) between two vectors has the following properties:
* positive if the angle between the vectors is < 90 degrees
* 0 if the angle between the vectors is 90 degrees
* negative if the angle between the vectors is > 90 degrees

Given that the weighted sum (dot product) between two vectors is 0 when the angle between them is 90 degrees, geometrically a decision boundary perpendicular to the weight vector is defined. This decision boundary can be thought of as the threshold function, if an input vector has a weighted sum (dot product) value >= 0 then it is assigned one class label, otherwise it is assigned the other. The interactive graph below visualises this: 
* $\vec{w}$ is the weight vector 
* red and blue points represent input vectors, each one has a label which shows the weighted sum (dot product) with the weight vector
* the dashed line is the decision boundary, input vector points are colored red or blue depending on which side of the decision boundary they lie
* the weight vector can be dragged around which in turn moves the decision boundary 

<div id="html" markdown="0">

  <div id="perceptron-decision-boundary" class="perceptron-decision-boundary" style="width: 100%; aspect-ratio : 1 / 1;"></div>

  <script>
    {% include vector-similarity-measures/utils.js %}

    {% include nn-perceptron/nn_decision_boundaries_chart.js %}

    createFirstExampleChart("perceptron-decision-boundary");
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


