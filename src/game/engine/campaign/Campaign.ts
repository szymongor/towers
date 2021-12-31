import { AiProcessor } from "../Ai/processor/AiProcessor";
import { MapBoard } from "../map/MapBoard";


class Campaign {

    map: MapBoard;
    aiProcessor: AiProcessor;

    constructor(map: MapBoard, aiProcessor: AiProcessor) {
        this.map = map;
        this.aiProcessor = aiProcessor;
    }

}

export { Campaign }