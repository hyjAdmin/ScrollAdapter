import { _decorator, Component, Node, Size, Layout, Sprite, SpriteFrame, UITransform, Color, Button, EventHandler } from 'cc';
import { ScrollAdapter } from '../abstract/ScrollAdapter';
import { IndicatorMode } from '../define/enum';
import { PageViewManager } from '../manager/PageViewManager';
const { ccclass, property } = _decorator;
/**
 * 简单Indicator示例
 * 如果你想要更多效果，请自行编写或扩展 Indicator
 */
@ccclass('Indicator')
export class Indicator extends Component {
    @property(ScrollAdapter) adapter: ScrollAdapter<any> = null
    @property({
        type: SpriteFrame,
    }) spriteFrame: SpriteFrame = null
    @property({ type: IndicatorMode }) indicatorMode: IndicatorMode = IndicatorMode.Normal
    @property cellSize: Size = new Size(10, 10)
    @property spacing: number = 10
    private _indicators: UITransform[] = []
    private _layout: Layout = null
    private _color: Color = new Color()
    get layout() {
        if (this._layout == null) {
            this._layout = this.getComponent(Layout) || this.addComponent(Layout)
            if (this.adapter.isHorizontal) {
                this._layout.type = Layout.Type.HORIZONTAL
                this._layout.spacingX = this.spacing
            } else {
                this._layout.type = Layout.Type.VERTICAL
                this._layout.spacingY = this.spacing
            }
            this._layout.resizeMode = Layout.ResizeMode.CONTAINER
        }
        return this._layout
    }
    protected __preload() {
        if (this.adapter) {
            this.adapter.pageViewManager.on(PageViewManager.Event.ON_PAGE_LENGTH_CHANGED, this._onPageLengthChanged, this)
            this.adapter.pageViewManager.on(PageViewManager.Event.ON_SCROLL_PAGE_END, this._onScrollPageEnd, this)
        }
    }

    private _onScrollPageEnd() {
        this.changedState()
    }
    private _onPageLengthChanged() {
        if (!this.adapter) return
        const indicators = this._indicators
        const length = this.adapter.viewManager.groupLength
        if (length === indicators.length) {
            return
        }
        let i = 0
        if (length > indicators.length) {
            for (i = 0; i < length; ++i) {
                if (!indicators[i]) {
                    indicators[i] = this._createIndicator(i)
                }
            }
        } else {
            const count = indicators.length - length
            for (i = count; i > 0; --i) {
                const transform = indicators[i - 1]
                this.node.removeChild(transform.node)
                indicators.splice(i - 1, 1)
            }
        }
        if (this.layout && this.layout.enabledInHierarchy) {
            this.layout.updateLayout()
        }
        this.changedState()
    }

    private _createIndicator(index: any) {
        const node = new Node()
        node.layer = this.node.layer
        const sprite = node.addComponent(Sprite)
        sprite.spriteFrame = this.spriteFrame
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        node.parent = this.node
        var transform = node.getComponent(UITransform)
        transform.setContentSize(this.cellSize)

        if (this.indicatorMode == IndicatorMode.Button) {
            var button = node.getComponent(Button) || node.addComponent(Button)
            var event = new EventHandler()
            event.component = "Indicator"
            event.handler = "_click"
            event.target = this.node
            event.customEventData = index
            button.clickEvents.push(event)
        }
        return transform
    }
    private _click(event: any, data: any) {
        this.adapter.pageViewManager.scrollToPage(this.adapter.pageViewManager.pageTurningSpeed, data)
    }
    public changedState() {
        const indicators = this._indicators
        if (indicators.length === 0 || !this.adapter) return
        const idx = this.adapter.pageViewManager.currentIndex
        if (idx >= indicators.length) return
        for (let i = 0; i < indicators.length; ++i) {
            const transform = indicators[i]
            const comp = transform.getComponent(Sprite)
            this._color.set(comp.color)
            this._color.a = 255 / 2
            comp.color = this._color
        }
        if (indicators[idx]) {
            const comp = indicators[idx].getComponent(Sprite)
            this._color.set(comp.color)
            this._color.a = 255
            comp.color = this._color
        }
    }
}

