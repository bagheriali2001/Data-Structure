const app = new Vue({
    el : "#app",
    data() {
        return {
            operation : "",
            matrixChooser : 1,
            needTwo : false,
            matrix1 : {row:[] ,col:[] ,data:[]},
            matrix2 : {row:[] ,col:[] ,data:[]},
            matrixRes : {row:[] ,col:[] ,data:[]},
            isOperationSelector: true,
            isMatrixDimensionsLength: false,
            isValueSetter: false,
            buttonText : "Next",
            isRestart : false,
            isButton : true,
            matrix1Row : 2,
            matrix1Col : 2,
            matrix2Row : 2,
            matrix2Col : 2,
            showMatrix : false,
            currentMatrix : 1,
            currentRow : 1,
            currentCol : 1,
            currentValue : 0
        }
    },
    watch: {
        operation(){
            if(this.operation=="transposed")
                this.needTwo = false
            else
                this.needTwo = true
        },
        currentMatrix(){
            if(this.currentMatrix > 2){
                this.currentMatrix = 2
            }
            else if(this.currentMatrix < 1){
                this.currentMatrix = 1
            }
        },
        currentRow(){
            if(this.currentRow < 1){
                this.currentRow = 1
            }
            else if(this.currentMatrix == 1 && this.currentRow > this.matrix1Row ){
                this.currentRow = this.matrix1Row
            }
            else if(this.currentMatrix == 2 && this.currentRow > this.matrix2Row ){
                this.currentRow = this.matrix2Row
            }
        },
        currentCol(){
            if(this.currentCol < 1){
                this.currentCol = 1
            }
            else if(this.currentMatrix == 1 && this.currentCol > this.matrix1Col ){
                this.currentCol = this.matrix1Col
            }
            else if(this.currentMatrix == 2 && this.currentCol > this.matrix2Col ){
                this.currentCol = this.matrix2Col
            }
        }
        
    },
    methods: {
        changeChoosedMatrix(){
            if(this.matrixChooser==1)
                this.matrixChooser=2
            else if(this.matrixChooser==2)
                this.matrixChooser=1
        },
        toSparse(matrix){
            var sparse = {row:matrix.row ,col:matrix.col ,data:[] ,terms:0}
            for(i in matrix.row){
                for (j in matrix.col) {
                    if (matrix.data[(parseInt(i) * matrix.col.length)+parseInt(j)]!=0) {
                        sparse.data.push([i ,j ,matrix.data[(parseInt(i) * matrix.col.length)+parseInt(j)]])
                        sparse.terms++;
                    }
                }
            }
            return sparse;
        },
        toNormal(sparse){
            var matrix = {row:sparse.row ,col:sparse.col ,data:[]}
            for(i in matrix.row){
                for (j in matrix.col) {
                    matrix.data[(parseInt(i) * sparse.col.length)+parseInt(j)]=0
                }
            }
            for(i in sparse.data){
                matrix.data[(parseInt(sparse.data[i][0]) * matrix.col.length)+parseInt(sparse.data[i][1])] = sparse.data[i][2]
            }
            return matrix;
        }, 
        addition(sparse1,sparse2){
            if(this.matrix1Row != this.matrix2Row || this.matrix1Col != this.matrix2Col){
                return 0;
            }
            var res = {row:sparse1.row ,col:sparse1.col ,data:[] ,terms:0}
            for(i in sparse1.row){
                for (j in sparse1.col) {
                    var sum = 0
                    for(k in sparse1.data){
                        if( parseInt(sparse1.data[k][0])==i && parseInt(sparse1.data[k][1])==j ){
                            sum += sparse1.data[k][2]
                            break
                        }
                    }
                    for(k in sparse2.data){
                        if( parseInt(sparse2.data[k][0])==i && parseInt(sparse2.data[k][1])==j ){
                            sum += sparse2.data[k][2]
                            break
                        }
                    }
                    if(sum!=0){
                        res.data.push([i,j,sum])
                    }
                }
            }
            return res
        },
        subtraction(sparse1,sparse2){
            if(this.matrix1Row != this.matrix2Row || this.matrix1Col != this.matrix2Col){
                return 0;
            }
            var res = {row:sparse1.row ,col:sparse1.col ,data:[] ,terms:0}
            for(i in sparse1.row){
                for (j in sparse1.col) {
                    var sum = 0
                    for(k in sparse1.data){
                        if( parseInt(sparse1.data[k][0])==i && parseInt(sparse1.data[k][1])==j ){
                            sum += sparse1.data[k][2]
                            break
                        }
                    }
                    for(k in sparse2.data){
                        if( sparse2.data[k][0]==i && sparse2.data[k][1]==j ){
                            sum -= sparse2.data[k][2]
                            break
                        }
                    }
                    if(sum!=0){
                        res.data.push([i,j,sum])
                    }
                }
            }
            return res
        },
        multiplication(sparse1,sparse2){
            if(this.matrix1Col != this.matrix2Row){
                return 0;
            }
            var res = {row:sparse1.row ,col:sparse1.col ,data:[] ,terms:0}
            for(i in sparse1.row){
                for (j in sparse2.col) {
                    var sum = 0
                    for(k in sparse1.data){
                        for(h in sparse2.data){
                            if(sparse1.data[k][0]==i && sparse2.data[h][1]==j && sparse1.data[k][1] == sparse2.data[h][0]){
                                sum += sparse1.data[k][2] * sparse2.data[h][2]
                            }
                        }
                    }
                    
                    if(sum!=0){
                        res.data.push([i,j,sum])
                    }
                }
            }
            return res
        },
        transposed(sparse){
            var result = {row:sparse.col ,col:sparse.row ,data:[] ,terms:sparse.terms}
            if(result.terms > 0){
                var rowSize = []
                for(i in result.row){
                    rowSize.push(0)
                }
                for(i in sparse.data){
                    rowSize[parseInt(sparse.data[i][1])]++
                    result.data.push([0,0,0])
                }
                var startOfRow = []
                startOfRow.push(0)
                var isFirst = true
                for(i in result.row){
                    if(isFirst){
                        isFirst=false
                    }
                    else{
                        startOfRow.push(startOfRow[i-1] + rowSize[i-1])
                    }
                }
                for(i in sparse.data){
                    var temp = startOfRow[sparse.data[i][1]]
                    result.data[temp][0]=sparse.data[i][1]
                    result.data[temp][1]=sparse.data[i][0]
                    result.data[temp][2]=sparse.data[i][2]
                    startOfRow[sparse.data[i][1]]++
                }
                return result
            }
        },
        buttonPress(){
            if(this.isOperationSelector){
                if(this.operation!=""){
                    this.isOperationSelector = false
                    this.isMatrixDimensionsLength = true
                    this.isValueSetter = false
                    this.isRestart=true    
                }
            }
            else if(this.isMatrixDimensionsLength){
                if(this.matrix1Row != 0 && this.matrix1Col != 0 && this.needTwo && this.matrix2Row != 0 && this.matrix2Col != 0){
                    this.setMatrix(1,this.matrix1Row,this.matrix1Col)
                    this.setMatrix(2,this.matrix2Row,this.matrix2Col)
                    this.showMatrix = true
                    this.isOperationSelector = false
                    this.isMatrixDimensionsLength = false
                    this.isValueSetter = true
                    this.buttonText = "Calculate"
                }
                else if(this.matrix1Row != 0 && this.matrix1Col != 0 && !this.needTwo ){
                    this.setMatrix(1,this.matrix1Row,this.matrix1Col)
                    this.showMatrix = true
                    this.isOperationSelector = false
                    this.isMatrixDimensionsLength = false
                    this.isValueSetter = true
                    this.buttonText = "Calculate"
                }
                else{

                }
            }
            else if(this.isValueSetter){
                this.isOperationSelector = false
                this.isMatrixDimensionsLength = false
                this.isValueSetter = false
                this.isButton = false
                if(this.operation=="addition"){
                    var mat1 = this.toSparse(this.matrix1)
                    var mat2 = this.toSparse(this.matrix2)
                    this.matrixRes.row=this.matrix1.row
                    this.matrixRes.col=this.matrix1.col
                    var matRes = this.addition(mat1,mat2)
                    this.matrixRes =this.toNormal(matRes)
                }
                else if(this.operation=="subtraction"){
                    var mat1 = this.toSparse(this.matrix1)
                    var mat2 = this.toSparse(this.matrix2)
                    this.matrixRes.row=this.matrix1.row
                    this.matrixRes.col=this.matrix1.col
                    var matRes = this.subtraction(mat1,mat2)
                    this.matrixRes =this.toNormal(matRes)
                }
                else if(this.operation=="multiplication"){
                    var mat1 = this.toSparse(this.matrix1)
                    var mat2 = this.toSparse(this.matrix2)
                    this.matrixRes.row=this.matrix1.row
                    this.matrixRes.col=this.matrix1.col
                    var matRes = this.multiplication(mat1,mat2)
                    console.log(matRes)
                    this.matrixRes =this.toNormal(matRes)
                }
                else if(this.operation=="transposed"){
                    var mat = this.toSparse(this.matrix1)
                    var res = this.transposed(mat)
                    this.matrixRes = this.toNormal(res)
                    console.log(res)
                }
            }
        },
        resetPress(){
            this.operation = ""
            this.matrixChooser = 1
            this.needTwo = false
            this.matrix1 = {row:[] ,col:[] ,data:[]}
            this.matrix2 = {row:[] ,col:[] ,data:[]}
            this.matrixRes = {row:[] ,col:[] ,data:[]}
            this.isOperationSelector= true
            this.isMatrixDimensionsLength= false
            this.isValueSetter= false
            this.buttonText = "Next"
            this.isRestart = false
            this.isButton = true
            this.matrix1Row = 2
            this.matrix1Col = 2
            this.matrix2Row = 2
            this.matrix2Col = 2
            this.showMatrix = false
            this.currentMatrix = 1
            this.currentRow = 1
            this.currentCol = 1
            this.currentValue = 0
        },
        setMatrix(matrixName,row,col){
            if(matrixName==1){
                for(var i=1; i<=row;i++){
                    this.matrix1.row.push(i)
                }
                for(var i=1; i<=col;i++){
                    this.matrix1.col.push(i)
                }
                for(var i=1; i<=row;i++){
                    for(var j=1; j<=col;j++){
                        this.matrix1.data.push(0)
                    }
                }
            }
            else if(matrixName==2){
                for(var i=1; i<=row;i++){
                    this.matrix2.row.push(i)
                }
                for(var i=1; i<=col;i++){
                    this.matrix2.col.push(i)
                }
                for(var i=1; i<=row;i++){
                    for(var j=1; j<=col;j++){
                        this.matrix2.data.push(0)
                    }
                }
            }
            else{
                for(var i=1; i<=row;i++){
                    this.matrixRes.row.push(i)
                }
                for(var i=1; i<=col;i++){
                    this.matrixRes.col.push(i)
                }
            }
        },
        setTiles(m,r,c){
            this.currentMatrix=m
            this.currentRow=r
            this.currentCol=c
            console.log("setTiles")
        },
        setValue(){
            console.log("setValue")
            if(this.currentMatrix==1){
                this.matrix1.data[(this.currentRow-1)*(this.matrix1.col.length)+this.currentCol-1] = parseInt(this.currentValue) 
                console.log("setValue*" + ((this.currentRow-1)*(this.matrix1.col.length)+this.currentCol-1) )
            }
            else if(this.currentMatrix==2){
                this.matrix2.data[(this.currentRow-1)*(this.matrix2.col.length)+this.currentCol-1] = parseInt(this.currentValue)
                console.log("setValue*" + ((this.currentRow-1)*(this.matrix2.col.length)+this.currentCol-1) )
            }
        }
    }
})