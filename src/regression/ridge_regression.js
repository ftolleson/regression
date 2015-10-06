/**
 * Created by acastillo on 10/6/15.
 */
var Matrix = require("ml-matrix");
var stats = require("ml-stat");


//Implements the Kernel ridge regression algorith.
//http://www.ics.uci.edu/~welling/classnotes/papers_class/Kernel-Ridge.pdf
function learn(X,Y,options){

    var Xi = new Matrix(X);
    var Yi = new Matrix(Y);
    var lambda = options.lambda||0.1;
    var kernelType = options.kernelType||"gaussian";
    var kernelParams = options.kernelParams || {"w":1};

    var K = kernel(kernelType, kernelParams, Xi, Xi);

    var n = Xi.rows;

    K.add(Matrix.eye(n,n).mulS(lambda));
    //console.log(K);

    var alpha = K.solve(Yi);
    //We return all that we need to predict new values
    return {"alpha":alpha, "X":Xi, "kernelType":kernelType, "kernelParams":kernelParams};
}

//Makes a set of prediction using the kernel ridge regression algorithm
function predict(newX, model){
    var K = kernel(model.kernelType, model.kernelParams, newX, model.X);

    return K.mmul(model.alpha);
}

//The kernel factory
function kernel(type, params, A, B){
    switch(type) {
        case "gaussian"://Also called radial basis function(RBF)
            return gaussianKernel(A,B,params.w);
            break;
        case "polynomial":
            return polynomialKernel(A,B,params.degree)
            break;
        case "fisher":
            break;
    }
}
//The gaussian kernel implementation. It has an error for predicting...
function gaussianKernel(A, B, w){
    //TODO Implements this kernel correctly
    var a = A.clone();
    var d = a.sub(B);//pairwiseSquaredDistances(X.transpose(), Z.transpose());
    var K = new Matrix(A.rows, A.rows);
    var i, j, k, diff;
    for(i=0;i< A.rows;i++){
        for(j=0;j< A.rows;j++){
            diff = 0;
            for(k=0;k< A.columns;k++){
                diff+=d[i][j]*d[i][j];
            }
            K[i][j]=Math.exp(-diff/w);
        }
    }
    return K;
}
//The polinomial kernel
function polynomialKernel(A, B, n){
    var d = A.mmul(B.transpose());
    var i, j;
    for(i=0;i< d.rows;i++){
        for(j=0;j< d.columns;j++){
            d[i][j]=Math.pow(d[i][j],n);
        }
    }
    return d;
}
//The nice fisher kernel. It should be here
function fisherKernel(A, B, paras){
    //TODO implement this kernel
}

module.exports = {learn:learn, predict:predict};


