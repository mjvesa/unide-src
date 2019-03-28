export const checkModel = model => {
  let idents = 0;
  let parens = 0;
  let hadIssues = false;
  model.forEach((str, index) => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(":
        if (idents !== 1) {
          console.log(
            `Wrong number of idents for new element. Should be 1 was ${idents}`
          );
          hadIssues = true;
        }
        idents--;
        parens++;
        break;
      case ")":
        parens--;
        if (parens < 0) {
          console.log("Parentheses not matched");
          hadIssues = true;
        }
        break;
      case "=":
        if (idents !== 2) {
          console.log(
            `Wrong number of idents for attribute. Should be 2 was ${idents}`
          );
          hadIssues = true;
        }
        idents -= 2;
        break;
      default:
        idents++;
    }
  });

  if (idents !== 0) {
    console.log("Extra idents.");
    hadIssues = true;
  }
  if (parens !== 0) {
    console.log("Parens not matched");
    hadIssues = true;
  }
  if (hadIssues) {
    console.log(JSON.stringify(model));
    debugger;
  } else {
    console.log("Model OK.");
  }
};
