"use client";

import { Img } from "../ui/Img";

interface Premium2DecorationProps {
  withAOS?: boolean;
  type?: "001" | "002" | "003" | "004";
}

const Premium2Decoration: React.FC<Premium2DecorationProps> = ({
  withAOS = true,
  type = "001",
}) => {
  const aosAttr = (animation: string) =>
    withAOS ? { "data-aos": animation } : {};

  return (
    <>
      {type === "001" ? (
        <>
          <div
            className="absolute -top-14 -left-4 z-20"
            {...aosAttr("fade-right")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-02.png"
                alt="Flower blue"
                wrapperClassName="w-24 h-[177px] animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute -top-14 -right-4 z-20"
            {...aosAttr("fade-left")}
          >
            <Img
              src="/assets/themes/premium-002/img/flower-blue-02.png"
              alt="Flower blue"
              wrapperClassName="w-24 h-[177px] animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>

          <div
            className="absolute -bottom-16 -right-7 z-20"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/flower-blue-01.png"
              alt="Flower blue"
              wrapperClassName="w-40 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-16 -left-7 z-20"
            {...aosAttr("fade-up")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-01.png"
                alt="Flower blue"
                wrapperClassName="w-40 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute -bottom-8 left-3 z-20"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/leaf-green-01.png"
              alt="Leaf green"
              wrapperClassName="w-24 aspect-square animate-leaf-wiggle"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-8 right-3 z-20"
            {...aosAttr("fade-up")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/leaf-green-01.png"
                alt="Leaf green"
                wrapperClassName="w-24 aspect-square animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute top-1/2 -left-7 z-20"
            {...aosAttr("fade-right")}
          >
            <div className="-translate-y-1/2">
              <Img
                src="/assets/themes/premium-002/img/leaf-blue-01.png"
                alt="Leaf blue"
                wrapperClassName="w-14 h-[94px] animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute top-1/2 -right-7 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="-translate-y-1/2 scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/leaf-blue-01.png"
                alt="Leaf blue"
                wrapperClassName="w-14 h-[94px] animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute w-16 top-[60%] -left-7 z-20"
            {...aosAttr("fade-right")}
          >
            <div className="-translate-y-1/2">
              <Img
                src="/assets/themes/premium-002/img/leaf-green-02.png"
                alt="Leaf green"
                wrapperClassName="w-16 aspect-square animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute w-16 top-[60%] -right-7 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="-translate-y-1/2 scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/leaf-green-02.png"
                alt="Leaf green"
                wrapperClassName="w-16 aspect-square animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute top-0 -left-28 z-0"
            {...aosAttr("fade-down")}
          >
            <Img
              src="/assets/themes/premium-002/img/abstrac-splash.png"
              alt="Leaf green"
              wrapperClassName="w-96 h-96 animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 -right-28 z-0"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/abstrac-splash.png"
              alt="Leaf green"
              wrapperClassName="w-96 h-96 animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
        </>
      ) : type === "002" ? (
        <>
          <div
            className="absolute -top-16 -right-7 z-20"
            {...aosAttr("fade-down")}
          >
            <div className="scale-y-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-01.png"
                alt="Flower blue"
                wrapperClassName="w-40 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute -top-16 -left-7 z-20"
            {...aosAttr("fade-down")}
          >
            <div className="scale-y-[-1] scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-01.png"
                alt="Flower blue"
                wrapperClassName="w-40 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute -bottom-16 -right-7 z-20"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/flower-blue-01.png"
              alt="Flower blue"
              wrapperClassName="w-40 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-16 -left-7 z-20"
            {...aosAttr("fade-up")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-01.png"
                alt="Flower blue"
                wrapperClassName="w-40 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>
        </>
      ) : type === "003" ? (
        <>
          <div
            className="absolute top-0 -left-28 z-0"
            {...aosAttr("fade-down")}
          >
            <Img
              src="/assets/themes/premium-002/img/abstrac-splash.png"
              alt="Leaf green"
              wrapperClassName="w-96 h-96 animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 -right-28 z-0"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/abstrac-splash.png"
              alt="Leaf green"
              wrapperClassName="w-96 h-96 animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
        </>
      ) : type === "004" ? (
        <>
          <div
            className="absolute -top-14 -left-4 z-20"
            {...aosAttr("fade-right")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-02.png"
                alt="Flower blue"
                wrapperClassName="w-24 h-[177px] animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute -top-14 -right-4 z-20"
            {...aosAttr("fade-left")}
          >
            <Img
              src="/assets/themes/premium-002/img/flower-blue-02.png"
              alt="Flower blue"
              wrapperClassName="w-24 h-[177px] animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>

          <div
            className="absolute -bottom-16 -right-7 z-20"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/flower-blue-01.png"
              alt="Flower blue"
              wrapperClassName="w-40 aspect-square animate-leaf-float"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-16 -left-7 z-20"
            {...aosAttr("fade-up")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/flower-blue-01.png"
                alt="Flower blue"
                wrapperClassName="w-40 aspect-square animate-leaf-float"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute -bottom-8 left-3 z-20"
            {...aosAttr("fade-up")}
          >
            <Img
              src="/assets/themes/premium-002/img/leaf-green-01.png"
              alt="Leaf green"
              wrapperClassName="w-24 aspect-square animate-leaf-wiggle"
              sizes="300px"
              priority
            />
          </div>
          <div
            className="absolute -bottom-8 right-3 z-20"
            {...aosAttr("fade-up")}
          >
            <div className="scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/leaf-green-01.png"
                alt="Leaf green"
                wrapperClassName="w-24 aspect-square animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>

          <div
            className="absolute top-1/2 -left-7 z-20"
            {...aosAttr("fade-right")}
          >
            <div className="-translate-y-1/2">
              <Img
                src="/assets/themes/premium-002/img/leaf-blue-01.png"
                alt="Leaf blue"
                wrapperClassName="w-14 h-[94px] animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute top-1/2 -right-7 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="-translate-y-1/2 scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/leaf-blue-01.png"
                alt="Leaf blue"
                wrapperClassName="w-14 h-[94px] animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute w-16 top-[60%] -left-7 z-20"
            {...aosAttr("fade-right")}
          >
            <div className="-translate-y-1/2">
              <Img
                src="/assets/themes/premium-002/img/leaf-green-02.png"
                alt="Leaf green"
                wrapperClassName="w-16 aspect-square animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
          <div
            className="absolute w-16 top-[60%] -right-7 z-20"
            {...aosAttr("fade-left")}
          >
            <div className="-translate-y-1/2 scale-x-[-1]">
              <Img
                src="/assets/themes/premium-002/img/leaf-green-02.png"
                alt="Leaf green"
                wrapperClassName="w-16 aspect-square animate-leaf-wiggle"
                sizes="300px"
                priority
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Premium2Decoration;
