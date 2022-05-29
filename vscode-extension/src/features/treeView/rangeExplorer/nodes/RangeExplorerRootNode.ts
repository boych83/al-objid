import { ALApp } from "../../../../lib/ALApp";
import { ContextValues } from "../../ContextValues";
import { Node } from "../../Node";
import { RootNode } from "../../RootNode";
import { ViewController } from "../../ViewController";
import { SyncObjectIdsCommandContext } from "../contexts/SyncObjectIdsCommandContext";
import { LogicalRangesGroupNode } from "./LogicalRangesGroupNode";
import { ObjectRangesGroupNode } from "./ObjectRangesGroupNode";
import { PhysicalRangeNode } from "./PhysicalRangeNode";
import { PhysicalRangesGroupNode } from "./PhysicalRangesGroupNode";

/**
 * Represents a root node for range explorer.
 */
export class RangeExplorerRootNode extends RootNode implements SyncObjectIdsCommandContext {
    constructor(app: ALApp, view: ViewController) {
        super(app, view);
        this._contextValues.push(ContextValues.sync);
    }

    protected override getChildren(): Node[] {
        const hasLogical = this._app.config.idRanges.length > 0;
        const hasObject = this._app.config.objectTypesSpecified.length > 0;

        let children: Node[] = [];

        if (!hasLogical && !hasObject) {
            children = this._app.manifest.idRanges.map(range => new PhysicalRangeNode(this, range));
        } else {
            children = [new PhysicalRangesGroupNode(this)];
        }

        if (hasLogical) {
            children!.push(new LogicalRangesGroupNode(this));
        }
        if (hasObject) {
            children!.push(new ObjectRangesGroupNode(this));
        }

        return children;
    }

    public get appId() {
        return this.app.hash;
    }
}