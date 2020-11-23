const app = new Vue({
    el: '#app',
    data() {
        return {
            stack1 : {id :1 , array:[]} ,
            stack2 : {id :2 , array:[]} ,
            stack3 : {id :3 , array:[]} ,
            vstack1 : {id :1 , array:[]} ,
            vstack2 : {id :2 , array:[]} ,
            vstack3 : {id :3 , array:[]} ,
            n : 0 ,
            maxPX : 400 ,
            minPX : 15 ,
            sleepTime : 8,
            steps : [] ,
            displayBasicControllers : true,
            displayAutoControllers : false,
            displayManualControllers : false,
            auto : false ,
            pause : true ,
            stepCounter : 0,
            totalStep : 0
        }
    },
    watch:{
        sleepTime(value){
            if(value <= 4){
                this.sleepTime = 4
            }
        },
        n(value){
            if(value <= 0){
                this.n = 0
            }
        }
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            })
        },
        vmove(from, to) {
            var temp = from.array.pop();
            to.array.push(temp);
            this.steps.push({ disk : temp.id , from : from.id , to : to.id })
            console.log( temp.id + " vmoved from " + from.id + " to " + to.id )
            this.totalStep++
        },
        move(from, to) {
            var temp = from.array.pop();
            to.array.push(temp);
            console.log( temp.id + " moved from " + from.id + " to " + to.id )
        },
        async moveAuto(from, to) {
            while(this.pause){
                await this.sleep(500)
            }
            var temp = from.array.pop();
            to.array.push(temp);
            console.log( temp.id + " moved from " + from.id + " to " + to.id )
            await this.sleep(this.sleepTime*100)
        },
        exHanoi(A, B, C, n) {
            if (n == 1) {
                this.vmove(C, B);
                this.vmove(A, C);
                this.vmove(B, A);
                this.vmove(B, C);
                this.vmove(A, C);
            }
            else {
                this.exHanoi(A, B, C, n - 1);
                this.hanoi(C, A, B, 3 * n - 2);
                this.vmove(A, C);
                this.hanoi(B, A, C, 3 * n - 1);
            }
        },
        hanoi(A, B, C, n) {
            if (n === 1) {
                this.vmove(A, C);
            }
            else {
                this.hanoi(A, C, B, n - 1);
                this.vmove(A, C);
                this.hanoi(B, A, C, n - 1);
            }
        },
        async setDisks(event) {
            if(event.target.value<1){
                event.target.value=1
            }
            this.n = parseInt(event.target.value)
            this.stack1 = {id :1 , array:[]}
            this.stack2 = {id :2 , array:[]}
            this.stack3 = {id :3 , array:[]}
            this.vstack1 = {id :1 , array:[]}
            this.vstack2 = {id :2 , array:[]}
            this.vstack3 = {id :3 , array:[]}
            let widthDiffrence = (parseInt(this.maxPX) - parseInt(this.minPX)) / (parseInt(this.n) * 3)
            for (var i = this.n ; i >= 1; i--) {
                this.stack1.array.push( { id : i * 3 , width : this.minPX + i * widthDiffrence * 3 } );
                await this.sleep(10)
                this.stack2.array.push( { id : i * 3 - 1 , width : this.minPX + (i * 3 - 1) * widthDiffrence  } );
                await this.sleep(10)
                this.stack3.array.push( { id : i * 3 - 2 , width : this.minPX + (i * 3 - 2) * widthDiffrence } );
                await this.sleep(10)
                this.vstack1.array.push( { id : i * 3 } );
                this.vstack2.array.push( { id : i * 3 - 1 } );
                this.vstack3.array.push( { id : i * 3 - 2 } );
            }
        },
        calculateSteps(mode){
            if(this.n>0){
                this.displayBasicControllers = false
                this.exHanoi(this.vstack1 , this.vstack2 , this.vstack3 , this.n)
                if(mode==="auto"){
                    this.displayAutoControllers = true
                    this.auto = true
                    this.autoRun()
                }
                else if(mode === "manual"){
                    this.displayManualControllers = true
                    this.auto = false
                }
            }   
        },
        setpause(){
            if(this.pause){
                this.pause = false 
            }
            else{
                this.pause = true
            }
        },
        oneStep(){
            if(this.stepCounter != this.totalStep){
                if(this.steps[this.stepCounter].from === 1 && this.steps[this.stepCounter].to === 2)
                    this.move(this.stack1 , this.stack2 )
                else if(this.steps[this.stepCounter].from === 1 && this.steps[this.stepCounter].to === 3)
                    this.move(this.stack1 , this.stack3 )
                else if(this.steps[this.stepCounter].from === 2 && this.steps[this.stepCounter].to === 1)
                    this.move(this.stack2 , this.stack1 )
                else if(this.steps[this.stepCounter].from === 2 && this.steps[this.stepCounter].to === 3)
                    this.move(this.stack2 , this.stack3 )
                else if(this.steps[this.stepCounter].from === 3 && this.steps[this.stepCounter].to === 1)
                    this.move(this.stack3 , this.stack1 )
                else if(this.steps[this.stepCounter].from === 3 && this.steps[this.stepCounter].to === 2)
                    this.move(this.stack3 , this.stack2 )
                this.stepCounter ++
            }
        },
        final(mode){
            if(mode==="auto"){
                this.auto = false
                this.stack1 = {id :1 , array:[]}
                this.stack2 = {id :2 , array:[]}
                this.stack3 = {id :3 , array:[]}
                let widthDiffrence = (parseInt(this.maxPX) - parseInt(this.minPX)) / (parseInt(this.n) * 3)
                for (var i = this.n ; i >= 1; i--) {
                    this.stack3.array.push( { id : i * 3 , width : this.minPX + i * widthDiffrence * 3 } );
                    this.stack3.array.push( { id : i * 3 - 1 , width : this.minPX + (i * 3 - 1) * widthDiffrence  } );
                    this.stack3.array.push( { id : i * 3 - 2 , width : this.minPX + (i * 3 - 2) * widthDiffrence } );
                }
            }
            else if(mode === "manual"){
                this.stack1 = {id :1 , array:[]}
                this.stack2 = {id :2 , array:[]}
                this.stack3 = {id :3 , array:[]}
                let widthDiffrence = (parseInt(this.maxPX) - parseInt(this.minPX)) / (parseInt(this.n) * 3)
                for (var i = this.n ; i >= 1; i--) {
                    this.stack3.array.push( { id : i * 3 , width : this.minPX + i * widthDiffrence * 3 } );
                    this.stack3.array.push( { id : i * 3 - 1 , width : this.minPX + (i * 3 - 1) * widthDiffrence  } );
                    this.stack3.array.push( { id : i * 3 - 2 , width : this.minPX + (i * 3 - 2) * widthDiffrence } );
                }
            }
            
        },
        async restart(mode){
            if(mode==="auto"){
                this.auto = false
                await this.sleep(200)
            }
            this.stack1 = {id :1 , array:[]}
            this.stack2 = {id :2 , array:[]}
            this.stack3 = {id :3 , array:[]}
            this.vstack1 = {id :1 , array:[]}
            this.vstack2 = {id :2 , array:[]}
            this.vstack3 = {id :3 , array:[]}
            let widthDiffrence = (parseInt(this.maxPX) - parseInt(this.minPX)) / (parseInt(this.n) * 3)
            for (var i = this.n ; i >= 1; i--) {
                this.stack1.array.push( { id : i * 3 , width : this.minPX + i * widthDiffrence * 3 } );
                this.stack2.array.push( { id : i * 3 - 1 , width : this.minPX + (i * 3 - 1) * widthDiffrence  } );
                this.stack3.array.push( { id : i * 3 - 2 , width : this.minPX + (i * 3 - 2) * widthDiffrence } );
                this.vstack1.array.push( { id : i * 3 } );
                this.vstack2.array.push( { id : i * 3 - 1 } );
                this.vstack3.array.push( { id : i * 3 - 2 } );
            }
            this.stepCounter = 0
            this.totalStep = 0
            this.displayBasicControllers = true
            this.displayAutoControllers = false
            this.displayManualControllers = false
            this.steps = []
            this.pause = true
        },
        async autoRun(){
            for(step in this.steps){
                if(this.auto){
                    if(this.steps[this.stepCounter].from === 1 && this.steps[this.stepCounter].to === 2)
                        await this.moveAuto(this.stack1 , this.stack2 )
                    else if(this.steps[this.stepCounter].from === 1 && this.steps[this.stepCounter].to === 3)
                        await this.moveAuto(this.stack1 , this.stack3 )
                    else if(this.steps[this.stepCounter].from === 2 && this.steps[this.stepCounter].to === 1)
                        await this.moveAuto(this.stack2 , this.stack1 )
                    else if(this.steps[this.stepCounter].from === 2 && this.steps[this.stepCounter].to === 3)
                        await this.moveAuto(this.stack2 , this.stack3 )
                    else if(this.steps[this.stepCounter].from === 3 && this.steps[this.stepCounter].to === 1)
                        await this.moveAuto(this.stack3 , this.stack1 )
                    else if(this.steps[this.stepCounter].from === 3 && this.steps[this.stepCounter].to === 2)
                        await this.moveAuto(this.stack3 , this.stack2 )
                    this.stepCounter ++
                }
            }
        }
    }
});