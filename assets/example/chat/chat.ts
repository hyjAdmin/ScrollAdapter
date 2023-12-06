import { _decorator, Component, Node, Prefab, UITransform, Tween, v3, Label, UIOpacity, Sprite, Color, EditBox, director } from 'cc';
import { Holder, IElement, ReleaseEvent, ReleaseManager, ReleaseState, ScrollAdapter, View, ViewManager } from '../../adapter';
import { chatItem } from "./chat_Item"
const { ccclass, property } = _decorator;
export interface IChatModel {
    type: number
    name: string
    message: string
}
@ccclass('chat')
export class chat extends ScrollAdapter<IChatModel> {
    @property(Node) myPrefab: Node = null
    @property(Node) youPrefab: Node = null
    @property(UITransform) header: UITransform = null
    @property(Sprite) loading: Sprite = null
    @property(EditBox) input: EditBox = null
    @property(Node) newMsgButton: Node = null
    @property(Label) newMsgLabel: Label = null
    private _headerTween: Tween<any>
    private _loadTween: Tween<any>
    private _newMsgShowTween: Tween<Node>
    private _newMsgHideTween: Tween<Node>
    private _isHeaderPlay = false
    private _newMsgTotal = 0
    private _isShowNewMsg: boolean
    public getPrefab(data: IChatModel): Node | Prefab {
        if (data.type == 0) {
            return this.myPrefab
        }
        return this.youPrefab
    }
    public getHolder(node: Node, code: string): Holder<IChatModel> {
        return new myHolder(node, code, this)
    }
    public getView(): View<IChatModel> {
        return new myView(this)
    }
    public initElement(element: IElement, data: any): void {
    }
    start() {
        this.releaseManager.on(ReleaseManager.Event.ON_PULL_DOWN, this.onPullDown, this)
        this._headerTween = new Tween(this.header).to(0.518, {
            height: this.releaseManager.top * this.mainAxisSize
        }, { easing: "elasticOut" })
        this._loadTween = new Tween(this.loading.node).by(1, {
            angle: -360
        }).union().repeatForever()

        this._newMsgShowTween = new Tween(this.newMsgButton).to(0.218, {
            position: v3(this.newMsgButton.position.x, 60)
        }, { easing: "smooth" })
        this._newMsgHideTween = new Tween(this.newMsgButton).to(0.218, {
            position: v3(this.newMsgButton.position.x, -100)
        }, { easing: "smooth" })

        this.viewManager.on(ViewManager.Event.ON_MAGNETIC, this._onMagnetic, this)
    }
    private _onMagnetic(ok: boolean) {
        if (ok) {
            this._newMsgTotal = 0
        } else {
            this.newMsgLabel.string = `${this._newMsgTotal}`
            if (!this._isShowNewMsg && this._newMsgTotal > 0) {
                this._isShowNewMsg = true
                this._newMsgHideTween.stop()
                this._newMsgShowTween.start()
            }
        }
    }
    onSend() {
        if (this.input.string.length == 0) return
        var data: IChatModel = {
            name: "我",
            message: this.input.string,
            type: 0
        }
        this._newMsgTotal++
        this.modelManager.insert(data, 0)
        this.unschedule(this.reply)
        this.scheduleOnce(this.reply, 1)
    }
    reply() {
        var data: IChatModel = {
            name: "小娜",
            message: this.input.string,
            type: 1
        }
        this._newMsgTotal++
        this.modelManager.insert(data, 0)
    }

    async onPullDown(event: ReleaseEvent) {
        if (event.state == ReleaseState.RELEASE) {
            if (this._isHeaderPlay) {
                this._loadTween.start()
                // 等待并锁定头部
                event.wait()
                // 加载历史记录
                var list = await this.loadMore()
                // 插入数据
                this.modelManager.insert(list)
                // 释放解锁头部
                this.scheduleOnce(() => {
                    event.release()
                })
                this._loadTween.stop()
            }
        }
        var progress = event.progress
        if (event.state == ReleaseState.WAIT) {
            progress = 1.5
        }
        if (progress >= 1.5) {
            if (!this._isHeaderPlay) {
                this._headerTween = new Tween(this.header).to(0.518, {
                    height: this.releaseManager.top * this.mainAxisSize
                }, { easing: "elasticOut" })
                this._headerTween.start()
                this._isHeaderPlay = true
            }
        } else {
            this._headerTween.stop()
            this._isHeaderPlay = false
            this.header.height = event.offset
            var color = new Color()
            color.set(this.loading.color)
            color.a = 255 * Math.min(progress, 1)
            this.loading.color = color
            // var y = 70 - 40 * progress
            // this.loading.node.setPosition(0, Math.max(y, 0))
        }
        this.loading.node.angle = -360 * event.progress
    }

    loadMore(): Promise<IChatModel[]> {
        return new Promise((resolve, reject) => {
            var list = []
            var total = this.modelManager.length == 0 ? 10 : 10
            for (let i = 0; i < total; i++) {
                var data: IChatModel = {
                    type: i % 2,
                    name: i % 2 == 0 ? "我" : "小娜",
                    message: this.modelManager.length + i + " 历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录历史记录！"
                }
                list.push(data)
            }
            this.scheduleOnce(() => {
                resolve(list)
            }, 1)
        })
    }
    scrollToHeader() {
        this.scrollManager.scrollToHeader(1)
    }
    home() {
        director.loadScene("home")
    }
    update() {
        if (this._isShowNewMsg) {
            if (this.scrollManager.percentage < 0.1) {
                this._isShowNewMsg = false
                this._newMsgTotal = 0
                this._newMsgShowTween.stop()
                this._newMsgHideTween.start()
            }
        }
    }
}

class myView extends View<IChatModel, chat> {

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class myHolder extends Holder<IChatModel, chat>{
    private _chatItem: chatItem = null
    protected onCreated(): void {
        this._chatItem = this.node.getComponent(chatItem)
    }
    protected onVisible(): void {
        this._chatItem.show(this)
    }
    protected onDisable(): void {
        this._chatItem.hide()
    }

}

