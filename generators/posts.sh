
function createPost ()
{
    local title="$1"
    local date="$2"
    local image="$3"
    local notebookName="$4"
    local outputFilePath="./_posts/${postDate}-${notebookName}.md"

    header='---\n'
    header=${header}'title: "'${title}'"\n'
    header=${header}'date: "'${date}'"\n'
    header=${header}'image: "'${image}'"\n'
    header=${header}'---\n'

    echo "${header}" > ${outputFilePath}
    jupyter nbconvert --to markdown ./notebooks/${notebookName}.ipynb  --TagRemovePreprocessor.remove_input_tags='{"hide"}'
    tail -n +3 ./notebooks/${notebookName}.md >> ${outputFilePath}

}

############################################################
# 1 - weighted sum 
############################################################

postDate='2024-04-06'
postTitle='Weighted Sum'
postImage='/assets/images/weighted-sum.svg'
notebookName='weighted-sum'

createPost "${postTitle}" "${postDate}" "${postImage}" "${notebookName}"

############################################################
# 2 - matrix multiplication 
############################################################

postDate='2024-04-24'
postTitle='Matrix Multiplication'
postImage='/assets/images/matrix-multiplication.svg'
notebookName='matrix-multiplication'

createPost "${postTitle}" "${postDate}" "${postImage}" "${notebookName}"


############################################################
# 3 - vector similarity measures 
############################################################

postDate='2024-06-14'
postTitle='Vector Similarity Measures'
postImage='/assets/images/vector-similarity-measures.svg'
notebookName='vector-similarity-measures'

createPost "${postTitle}" "${postDate}" "${postImage}" "${notebookName}"


############################################################
# clean up 
############################################################

rm ./notebooks/*.md