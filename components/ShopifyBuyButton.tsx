import { useEffect, useRef } from "react";

interface Props {
  productId: string | number;
}

const buyButtonOptions = {
  product: {
    styles: {
      product: {
        "@media (min-width: 601px)": {
          "max-width": "calc(25% - 20px)",
          "margin-left": "20px",
          "margin-bottom": "50px",
        },
      },
      button: {
        "font-weight": "bold",
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
        ":hover": {
          "background-color": "#b84545",
        },
        "background-color": "#cc4d4d",
        ":focus": {
          "background-color": "#b84545",
        },
      },
      quantityInput: {
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
      },
    },
    buttonDestination: "checkout",
    text: {
      button: "Buy now",
    },
    // don't render in an iframe or include any styles - lets you style it yourself
    // iframe: false,
  },
  productSet: {
    styles: {
      products: {
        "@media (min-width: 601px)": {
          "margin-left": "-20px",
        },
      },
    },
  },
  modalProduct: {
    contents: {
      img: false,
      imgWithCarousel: true,
      button: false,
      buttonWithQuantity: true,
    },
    styles: {
      product: {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0px",
          "margin-bottom": "0px",
        },
      },
      button: {
        "font-weight": "bold",
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
        ":hover": {
          "background-color": "#b84545",
        },
        "background-color": "#cc4d4d",
        ":focus": {
          "background-color": "#b84545",
        },
      },
      quantityInput: {
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
      },
    },
    text: {
      button: "Add to cart",
    },
  },
  option: {},
  cart: {
    styles: {
      button: {
        "font-weight": "bold",
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
        ":hover": {
          "background-color": "#b84545",
        },
        "background-color": "#cc4d4d",
        ":focus": {
          "background-color": "#b84545",
        },
      },
    },
    text: {
      total: "Subtotal",
      button: "Checkout",
    },
    // open in popup vs a new window
    popup: false,
  },
  toggle: {
    styles: {
      toggle: {
        "font-weight": "bold",
        "background-color": "#cc4d4d",
        ":hover": {
          "background-color": "#b84545",
        },
        ":focus": {
          "background-color": "#b84545",
        },
      },
      count: {
        "font-size": "16px",
      },
    },
  },
};

function loadScript(productId: number | string, node: HTMLDivElement) {
  var scriptURL =
    "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  var script = document.createElement("script");
  script.async = true;
  script.src = scriptURL;
  (
    document.getElementsByTagName("head")[0] ||
    document.getElementsByTagName("body")[0]
  ).appendChild(script);
  script.onload = () => ShopifyBuyInit(productId, node);
}

function ShopifyBuyInit(productId: number | string, node: HTMLDivElement) {
  var client = ShopifyBuy.buildClient({
    domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "",
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "",
  });
  console.log("pid", productId);
  (ShopifyBuy as any).UI.onReady(client).then(function (ui: any) {
    console.log("createproduct");

    if (node.innerHTML) {
      node.innerHTML = "";
    }

    ui.createComponent("product", {
      id: String(productId),
      node,
      moneyFormat: "%24%7B%7Bamount%7D%7D",
      options: buyButtonOptions,
    });
  });
}

function loadBuyButton(productId: number | string, node: HTMLDivElement) {
  if (window.ShopifyBuy) {
    if ((window.ShopifyBuy as any).UI) {
      ShopifyBuyInit(productId, node);
    } else {
      loadScript(productId, node);
    }
  } else {
    loadScript(productId, node);
  }
}

export default function ShopifyBuyButton({ productId }: Props) {
  const productContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      // only run on the client
      return;
    }

    const el = productContainer.current;
    if (el) {
      console.log("loading buy button");
      loadBuyButton(productId, el);
    }

    return () => {
      console.log("umnmounting3");
      if (el?.innerHTML) {
        el.innerHTML = "";
      }
    };
  }, [productId]);

  return (
    <div
      className="productContainer"
      id={`buy-now-${productId}`}
      ref={productContainer}
    />
  );
}
