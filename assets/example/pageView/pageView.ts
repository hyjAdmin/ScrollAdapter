import { _decorator, Component, Node, Prefab, director } from 'cc';
import { Holder, IElement, ScrollAdapter, View, WrapMode } from '../../adapter';
import { pageView_item } from './pageView_item';
const { ccclass, property } = _decorator;
export interface IPageViewModel {
    name: string
    type: number
    wrapBefore?: WrapMode
    wrapAfter?: WrapMode
}
@ccclass('pageView')
export class pageView extends ScrollAdapter<IPageViewModel> {
    @property(Prefab) prefab1: Prefab = null
    @property(Prefab) prefab2: Prefab = null
    public getPrefab(data: IPageViewModel): Node | Prefab {
        if (data.type == 0) {
            return this.prefab1
        }
        return this.prefab2
    }
    public getHolder(node: Node, code: string): Holder<any> {
        return new MyHolder(node, code, this)
    }
    public getView(): View<any> {
        return new MyView(this)
    }
    public initElement(element: IElement, data: IPageViewModel): void {
    }
    home() {
        director.loadScene("home")
    }
    start() {
        var list = []
        for (let i = 0; i < 10; i++) {
            list.push({
                name: `# ${i}`,
                type: i % 2
            })
        }
        this.modelManager.insert(list)
    }
    scrollToPrevPage() {
        this.pageViewManager.scrollToPrevPage()
    }
    scrollToNextPage() {
        this.pageViewManager.scrollToNextPage()
    }
}
class MyView extends View<IPageViewModel>{

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<IPageViewModel, pageView>{
    private _item: pageView_item = null
    protected onCreated(): void {
        this._item = this.node.getComponent(pageView_item)
    }
    protected onVisible(): void {
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }

}

