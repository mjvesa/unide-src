#imports
for i in $(find | grep .js$) 
do 
  if grep --quiet -s -e customElements.define $i 
  then  
      echo -e "import \"$i\";" 
  fi 
done


#Array of tags
echo -e -n let tags = [[\"div\",[\"div\",\"\(\", \"\)\"]],
echo -e -n [\"span\",[\"span\",\"\(\", \"\)\"]],

for i in $(find | grep .js$) 
do 
  if grep --quiet -s -e customElements.define $i 
  then
      element=$(basename $i | cut -f 1 -d '.')
      echo -e  [\"$element\", [\"$element\", \"\(\", \"\)\"]], 
  fi 
done
echo "]"
