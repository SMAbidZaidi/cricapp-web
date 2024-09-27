"use client";
import { MatchInfo } from "@/@types";
import { useEffect, useState } from "react";
import Img from "../Img/Img";
import Loading from "@/app/loading";
import useEmblaCarousel from "embla-carousel-react";
import NoData from "../Error/NoData";
import MatchNotFound from "../Error/MatchNotFound";

interface MatchDetailsOddTabProps {
  matchInfo: MatchInfo;
}

interface MarketDataState {
  market_update_data: any;
  market_price_update_data: any;
}

export const MatchDetailsOddTab: React.FC<MatchDetailsOddTabProps> = ({ matchInfo }) => {
  const [marketData, setMarketData] = useState<MarketDataState>({
    market_price_update_data: {},
    market_update_data: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const team1Name = encodeURIComponent(matchInfo?.team1?.name || "");
    const team2Name = encodeURIComponent(matchInfo?.team2?.name || "");
    const url = `https://backend.stage.cricap.com/api/decimal/match/markets?team1=${team1Name}&team2=${team2Name}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData?.msg_type == "market_update") {
        setMarketData((prev) => {
          return { ...prev, market_update_data: parsedData };
        });
      } else if (parsedData?.msg_type == "market_price_update") {
        setMarketData((prev) => {
          return { ...prev, market_price_update_data: parsedData };
        });
      }
      setIsLoading(false);
      setIsError(false);
    };

    eventSource.onerror = (e) => {
      setIsError(true);
    };

    return () => {
      eventSource.close();
    };
  }, [matchInfo?.team1?.name, matchInfo?.team2?.name]);

  console.log(isLoading);

  if (isLoading && !isError) {
    return <Loading />;
  } else if (isError) {
    return <MatchNotFound />;
  } else {
    return (
      <div className="w-full h-full flex justify-center place-items-center px-2">
        <div className="flex flex-col gap-3 w-full">
          <div className="bg-mainGreen text-white px-2 md:px-3 py-2 flex justify-between">
            <p className="font-bold text-lg flex place-items-center gap-1">
              <Img src={"/assets/imgs/icons/update.svg"} height={24} width={24} alt="update" />
              <span className="md:text-xl">Market Update</span>
            </p>
            <span
              className={`${
                marketData.market_update_data?.market_update?.betting_status == "ACTIVE"
                  ? "bg-red-500"
                  : "bg-mainBg text-black"
              } rounded-full px-2 text-center lowercase`}
            >
              {marketData.market_update_data?.market_update?.betting_status}
            </span>
          </div>
          {marketData.market_update_data?.market_update?.markets?.length === 0 ? (
            <NoData />
          ) : (
            marketData.market_update_data?.market_update?.markets?.map((market: any) => {
              return (
                <MarketCard
                  key={market?.market_id}
                  market={market}
                  marketPrice={marketData?.market_price_update_data?.market_price_update?.markets?.find(
                    (price_data: any) => price_data?.market_id === market?.market_id
                  )}
                />
              );
            })
          )}
        </div>
      </div>
    );
  }
};

interface MarketCardProps {
  market: any;
  marketPrice: any;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, marketPrice }) => {
  const [emblaRef] = useEmblaCarousel({ dragFree: true });
  const selectionsMoreThan2 = market?.selections?.length > 2;

  return (
    <div className="bg-white w-full min-h-24 shadow-lg">
      <div className="w-full text-white font-bold bg-mainGreen px-2 md:px-3 py-2">{market?.market_group}</div>
      <div
        className={`px-2 md:px-3 py-2 flex overflow-hidden ${
          selectionsMoreThan2 ? "flex-col gap-2" : "flex-row justify-between place-items-center"
        }`}
      >
        <span className="">{market?.name}</span>

        {/* <div className={`w-full bg-mainGreen bg-opacity-50 hidden ${selectionsMoreThan2 ? "block" : ""}`}>Prices</div> */}
        <div className="overflow-hidden select-none cursor-grab" ref={emblaRef}>
          <span className="flex place-items-center gap-1">
            {market?.selections?.map((selection: any) => {
              return (
                <div
                  key={selection?.uid}
                  className={`${
                    selection?.name?.toLowerCase() == "yes"
                      ? "bg-mainGreen text-white"
                      : selection?.name?.toLowerCase() == "no"
                      ? "bg-red-500 text-white"
                      : selection?.name?.toLowerCase() == "over"
                      ? "bg-mainGreen text-white"
                      : selection?.name?.toLowerCase() == "under"
                      ? "bg-red-500 text-white"
                      : "bg-mainBgLight"
                  }  rounded-sm text-nowrap flex flex-col justify-center place-items-center min-w-16 text-center`}
                >
                  <span className="font-semibold bg-gray-700 text-white px-2 py-1 w-full">{selection?.name}</span>

                  <span className="px-2 py-1 w-full">
                    {
                      marketPrice?.selections?.find((selection_price: any) => selection_price?.name == selection?.name)
                        ?.back_price
                    }
                  </span>
                </div>
              );
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
