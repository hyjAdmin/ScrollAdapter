
import { _decorator, Component, Node, Prefab } from 'cc';
import { Holder, IElement, Layer, ScrollAdapter, View } from '../../adapter';
const { ccclass, property } = _decorator;
export interface ISummaryModel {
    fixed: boolean
    prefabType: number
}
@ccclass('Summary')
export class Summary extends ScrollAdapter<ISummaryModel> {
    @property(Node) fixedPrefab: Node = null
    @property(Node) normalPrefab1: Node = null
    @property(Node) normalPrefab2: Node = null
    public getPrefab(data: ISummaryModel): Node | Prefab {
        if (data.fixed) {
            return this.fixedPrefab
        }
        if (data.prefabType == 1) return this.normalPrefab1
        return this.normalPrefab2
    }
    public getView(): View<ISummaryModel, ScrollAdapter<ISummaryModel>> {
        return new MyView(this)
    }
    public getHolder(node: Node, code: string): Holder<ISummaryModel, ScrollAdapter<ISummaryModel>> {
        return new MyHolder(node, code, this)
    }
    public initElement(element: IElement, data: ISummaryModel) {
        element.fixed = data.fixed
        if (element.fixed) {
            element.layer = Layer.Highest
        }

    }

    protected start(): void {
        var list: ISummaryModel[] = []
        for (let i = 0; i < 100; i++) {
            list.push({
                fixed: i % 10 == 0,
                prefabType: 1
            })
        }
        this.modelManager.insert(list)

    }


}

class MyView extends View<ISummaryModel, Summary>{
    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<ISummaryModel, Summary>{
    protected onCreated(): void {
    }
    protected onVisible(): void {
    }
    protected onDisable(): void {
    }

}