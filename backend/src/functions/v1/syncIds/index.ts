import { AzureFunction } from "@azure/functions";
import { RequestHandler } from "../../../common/RequestHandler";
import { RequestValidator } from "../../../common/RequestValidator";
import { AppAuthorization, BodyWithAppId, BodyWithAuthorization, BodyWithObjectIds } from "../../../common/types";
import { updateConsumptions } from "../../../common/updates";

interface SyncIdsBody extends BodyWithAppId, BodyWithObjectIds, BodyWithAuthorization {};
interface SyncIdsBindings {
    authorization: AppAuthorization;
}

const httpTrigger: AzureFunction = RequestHandler.handleAuthorized<SyncIdsBindings, SyncIdsBody>(
    async (_, req) => {
        const { appId, ids } = req.body;

        return await updateConsumptions(appId, ids, req.method === "PATCH");
    },
    new RequestValidator([
        BodyWithAppId.validateAppId,
        BodyWithObjectIds.validateObjectIds,
    ])
);

export default httpTrigger;