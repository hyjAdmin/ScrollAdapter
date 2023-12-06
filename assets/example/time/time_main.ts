
import { _decorator, Component, Node, director } from 'cc';
import { Time } from './time';
const { ccclass, property } = _decorator;
@ccclass('TimeMain')
export class TimeMain extends Component {
    @property(Time) timeYear: Time = null
    @property(Time) timeMoon: Time = null
    @property(Time) timeDay: Time = null
    home() {
        director.loadScene("home")
    }
    now() {
        var date = new Date()
        this.timeYear.scrollTo(2, date.getFullYear())
        this.timeMoon.scrollTo(1, date.getMonth() + 1)
        this.timeDay.scrollTo(1, date.getDate())
    }
    protected start(): void {
        this.scheduleOnce(() => {
            this.now()
        })
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
