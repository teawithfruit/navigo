type QChild = {
  type: "child";
  funcs: Array<Function | Array<any> | QChild>;
};

export default function Q(
  funcs: Array<Function | Array<any> | QChild>,
  c?: any,
  done?: Function
) {
  const context = c || {};
  let idx = 0;

  (function next() {
    if (!funcs[idx]) {
      if (done) {
        done(context);
      }
      return;
    }
    if (Array.isArray(funcs[idx])) {
      funcs.splice(
        idx,
        1,
        ...(funcs[idx][0](context) ? funcs[idx][1] : funcs[idx][2])
      );
      next();
    } else {
      // console.log(funcs[idx].name + " / " + JSON.stringify(context));
      // console.log(funcs[idx].name);
      (funcs[idx] as Function)(context, (moveForward) => {
        if (typeof moveForward === "undefined" || moveForward === true) {
          idx += 1;
          next();
        } else if (done) {
          done(context);
        }
      });
    }
  })();
}

Q.if = function (condition: Function, one, two) {
  if (!Array.isArray(one)) one = [one];
  if (!Array.isArray(two)) two = [two];
  return [condition, one, two];
};
