import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

export default async () => {
  render(<Extension />, document.body);
};

const API_VERSION = "2025-10";

const getCustomerNameQuery = {
  query: `query {
    customer {
      firstName
    }
  }`,
};

function Extension() {
  const order = shopify.order.value;
  const shippingAddress = shopify.shippingAddress.value;
  const customer = shopify.buyerIdentity.customer.value;

  const [expanded, setExpanded] = useState({
    section1: false,
    section2: false,
  });


  return (
    <s-section heading="Edit your order">
      <s-stack border="base" borderRadius="base">
        <s-clickable
          padding="small-100"
          onClick={() =>
            setExpanded({ ...expanded, section1: !expanded.section1 })
          }
          accessibilityLabel="Edit shipping address"
        >
          <s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
            <s-box>
              <s-heading>Edit shipping address</s-heading>
              <s-paragraph color="subdued">
                Edit the shipping address for your order now.
              </s-paragraph>
            </s-box>
            <s-icon type={expanded.section1 ? "chevron-up" : "chevron-down"} />
          </s-grid>
        </s-clickable>
        <s-stack
          gap="base"
          padding="large"
          display={expanded.section1 ? "auto" : "none"}
        >
          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
            <s-text-field
              label="First name"
              value={shippingAddress.firstName}
            />

            <s-text-field label="Last name" value={shippingAddress.lastName} />
          </s-grid>

          <s-text-field label="Phone" value={shippingAddress.phone} />

          <s-text-field label="Address" value={shippingAddress.address1} />

          <s-text-field
            label="Apartment, suite, etc. (optional)"
            value={shippingAddress.address2}
          />

          <s-grid gridTemplateColumns="1fr 1fr" gap="base">
            <s-text-field label="City" value={shippingAddress.city} />
            <s-text-field label="ZIP Code" value={shippingAddress.zip} />
          </s-grid>

          <s-grid justifyContent="end" gap="base">
            <s-button variant="primary">Save address</s-button>
          </s-grid>
        </s-stack>

        <s-box paddingInline="small-100">
          <s-divider />
        </s-box>

        <s-clickable
          padding="small-100"
          onClick={() =>
            setExpanded({ ...expanded, section2: !expanded.section2 })
          }
          accessibilityLabel="Add a product to your order"
        >
          <s-grid gridTemplateColumns="1fr auto" alignItems="center" gap="base">
            <s-box>
              <s-heading>Add a product to your order</s-heading>
              <s-paragraph color="subdued">
                Add a product to your order.
              </s-paragraph>
            </s-box>
            <s-icon
              type={expanded.section2 ? "chevron-up" : "chevron-down"}
            ></s-icon>
          </s-grid>
        </s-clickable>
        <s-stack
          gap="small"
          padding="base"
          display={expanded.section2 ? "auto" : "none"}
        >
          <s-paragraph>
            Add a product to your order. TODO...
          </s-paragraph>
        </s-stack>
      </s-stack>
    </s-section>
  );
}
