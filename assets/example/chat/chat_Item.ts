import { _decorator, Component, Node, Label, UITransform, Widget, RichText, InstancedBuffer } from 'cc';
import { Holder } from '../../adapter';
import { chat, IChatModel } from './chat';
const { ccclass, property } = _decorator;
@ccclass('chatItem')
export class chatItem extends Component {
    @property(Label) nameLabel: Label = null
    @property(Label) messageLabel: Label = null
    @property(UITransform) messageBg: UITransform = null
    private _holder: Holder<IChatModel> = null
    private _messageLabelTr: UITransform
    onLoad() {
        this._messageLabelTr = this.messageLabel.getComponent(UITransform)
    }
    onEnable() {
        this.messageLabel.node.on(Node.EventType.SIZE_CHANGED, this.onMessageSizeChanged, this)
    }
    onDisable() {
        this.messageLabel.node.off(Node.EventType.SIZE_CHANGED, this.onMessageSizeChanged, this)
    }
    show(holder: Holder) {
        this._holder = holder
        this._messageLabelTr.width = 0
        this.nameLabel.string = this._holder.data.name + ""
        this.showMessage()
    }
    hide() {
        this._messageLabelTr.width = 0
        this.messageBg.width = 0
    }

    showMessage() {
        this.messageLabel.overflow = Label.Overflow.NONE
        this.messageLabel.string = this._holder.data.message
    }
    onMessageSizeChanged() {
        if (!this._holder || !this.node.active) return console.error("没有显示")
        var maxWidth = this._holder.adapter.crossAxisSize - 200
        if (this._messageLabelTr.width > maxWidth) {
            this.messageLabel.overflow = Label.Overflow.RESIZE_HEIGHT
            this._messageLabelTr.width = maxWidth
            return
        }
        // 马勒戈壁 这里修改不起作用，必须延迟一帧
        // this.messageBg.setContentSize(this._messageLabelTr.width, this._messageLabelTr.height)
        this.scheduleOnce(() => {
            console.log("修改背景")
            this.messageBg.setContentSize(this._messageLabelTr.width + 40, this._messageLabelTr.height + 30)
            this._holder.transform.height = Math.max(this.messageBg.height, 100)
            // 不手动调用也不会更新
            this.messageBg.getComponent(Widget).updateAlignment()
        })
    }
}

