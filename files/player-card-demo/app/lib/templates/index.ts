import { TemplateId, PlayerCardInput } from "../players";
import { MinimalTemplate } from "./minimal";
import { EsportsTemplate } from "./esports";
import { TradingTemplate } from "./trading";

export const TEMPLATE_COMPONENTS: Record<
  TemplateId,
  (props: { data: PlayerCardInput }) => React.ReactElement
> = {
  minimal: MinimalTemplate,
  esports: EsportsTemplate,
  trading: TradingTemplate,
};

// Trading card is taller/narrower; others share a wider landscape size.
export const TEMPLATE_DIMENSIONS: Record<TemplateId, { width: number; height: number }> = {
  minimal: { width: 600, height: 500 },
  esports: { width: 600, height: 500 },
  trading: { width: 480, height: 560 },
};
