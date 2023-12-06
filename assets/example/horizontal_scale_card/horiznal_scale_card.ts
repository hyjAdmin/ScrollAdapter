import { _decorator, Component, Node, Prefab, v3 } from 'cc';
import { Holder, IElement, ScrollAdapter, View } from '../../adapter';
import { horiznal_scale_card_item } from './horiznal_scale_card_item';
const { ccclass, property } = _decorator;
@ccclass('horiznal_scale_card')
export class horiznal_scale_card extends ScrollAdapter {
    @property(Prefab) prefab: Prefab = null
    public getPrefab(data: any): Node | Prefab {
        return this.prefab
    }
    public getHolder(node: Node, code: string): Holder<any> {
        return new myHolder(node, code, this)
    }
    public getView(): View<any> {
        return new myView(this)
    }
    public initElement(element: IElement, data: any): void {
        // element.wrapBeforeMode = WrapMode.Auto
    }
    start() {
        var list = []
        for (let i = 0; i < 20; i++) {
            list.push({
                name: i,
                index: i
            })
        }
        this.modelManager.insert(list)
    }
    click() {
        // this.scrollManager.scrollToPercentage(1, 1)
        this.scrollManager.scrollToHeader(0)
        // this.viewManager.spacing = 50
    }
    click2() {
        // this.scrollManager.scrollToPercentage(1, 0)
        this.scrollManager.scrollToFooter(1)
        // this.viewManager.spacing = 2

        // this.scrollManager.scrollToOptionsIndex(0, 29)
    }
}
class myView extends View {

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class myHolder extends Holder {
    _script: horiznal_scale_card_item = null
    protected onCreated(): void {
        this._script = this.node.getComponent(horiznal_scale_card_item)
    }
    protected onVisible(): void {
        this._script.show(this)
    }
    protected onDisable(): void {
        this._script.hide()
    }
}

