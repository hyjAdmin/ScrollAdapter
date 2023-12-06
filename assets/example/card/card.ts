import { _decorator, Component, Node, Prefab, director } from 'cc';
import { ScrollAdapter, Holder, IElement, ChildAlignment, View } from '../../adapter';
import { card_item } from './card_item';
const { ccclass, property } = _decorator;
export interface ICardModel {
    name: string
}
@ccclass('card')
export class card extends ScrollAdapter<ICardModel> {
    @property(Node) prefab: Node = null
    public getPrefab(data: ICardModel): Node | Prefab {
        return this.prefab
    }
    public getHolder(node: Node, code: string): Holder<ICardModel> {
        return new MyHolder(node, code, this)
    }
    public getView(): View<ICardModel> {
        return new MyView(this)
    }
    public initElement(element: IElement, data: ICardModel) {
    }
    start() {
        var list = []
        for (let i = 0; i < 100; i++) {
            list.push({ name: i + "" })
        }
        this.modelManager.insert(list)
    }
    home() {
        director.loadScene("home")
    }
    typeUpper() {
        this.layoutManager.childAlignment = ChildAlignment.UpperLeft
    }
    typeMiddle() {
        this.layoutManager.childAlignment = ChildAlignment.MiddleLeft
    }
    typeLower() {
        this.layoutManager.childAlignment = ChildAlignment.LowerLeft
    }
}
class MyView extends View<ICardModel>{
    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<ICardModel>{
    private _item: card_item = null
    protected onCreated(): void {
        this._item = this.node.getComponent(card_item)
    }
    protected onVisible(): void {
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }

}

