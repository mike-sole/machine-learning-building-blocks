
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
    jupyter nbconvert --to markdown ./notebooks/${notebookName}.ipynb
    tail -n +3 ./notebooks/${notebookName}.md >> ${outputFilePath}

}

############################################################
# 1 - weighted sum 
############################################################

postDate='2024-04-06'
postTitle='Weighted Sum'
postImage='/assets/images/weighted-sum.svg'
notebookName='1_weighted_sum'

createPost "${postTitle}" "${postDate}" "${postImage}" "${notebookName}"

############################################################
# 2 - matrix multiplication 
############################################################

postDate='2024-04-21'
postTitle='Matrix Multiplication'
postImage='/assets/images/weighted-sum.svg'
notebookName='2_matrix_multiplication'

createPost "${postTitle}" "${postDate}" "${postImage}" "${notebookName}"


############################################################
# clean up 
############################################################

rm ./notebooks/*.md