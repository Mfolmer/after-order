import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useRef, useState } from "preact/hooks";

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const order = shopify.order.value;
  const initialAddress = shopify.shippingAddress.value || {};

  // TODO: Change to the actual URL when the app is deployed
  const APP_URL = "https://solve-boost-elderly-edgar.trycloudflare.com";

  const [loading, setLoading] = useState(false);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const cityRef = useRef(null);
  const zipRef = useRef(null);

  const [expanded, setExpanded] = useState({
    section1: false,
    section2: false,
  });

  const handleSave = async () => {
    setLoading(true);

    try {
      const token = await shopify.sessionToken.get();
      const response = await fetch(`${APP_URL}/api/update-shipping`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          shippingAddress: {
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
            phone: phoneRef.current?.value,
            address1: address1Ref.current?.value,
            address2: address2Ref.current?.value,
            city: cityRef.current?.value,
            zip: zipRef.current?.value,
          },
        }),
      });

      if (!response.ok) {
        console.error("Failed to update address");
        // Handle error (e.g. show toast if available, or alert)
      } else {
        const data = await response.json();
        console.log("Address updated", data);
        setExpanded({ ...expanded, section1: false });
      }
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <s-form onSubmit={handleSave}>
        <s-stack
          gap="base"
          padding="large"
          display={expanded.section1 ? "auto" : "none"}
        >
            <s-grid gridTemplateColumns="1fr 1fr" gap="base">
              <s-text-field
                label="First name"
                name="firstName"
                defaultValue={initialAddress.firstName}
                ref={firstNameRef}
              />
              <s-text-field
                label="Last name"
                name="lastName"
                defaultValue={initialAddress.lastName}
                ref={lastNameRef}
              />
            </s-grid>

            <s-text-field
              label="Phone"
              name="phone"
              defaultValue={initialAddress.phone}
              ref={phoneRef}
            />
            <s-text-field
              label="Address"
              name="address1"
              defaultValue={initialAddress.address1}
              ref={address1Ref}
            />

            <s-text-field
              label="Apartment, suite, etc. (optional)"
              name="address2"
              defaultValue={initialAddress.address2}
              ref={address2Ref}
            />

            <s-grid gridTemplateColumns="1fr 1fr" gap="base">
              <s-text-field
                label="City"
                name="city"
                defaultValue={initialAddress.city}
                ref={cityRef}
              />
              <s-text-field
                label="ZIP Code"
                name="zip"
                defaultValue={initialAddress.zip}
                ref={zipRef}
              />
            </s-grid>

            <s-grid justifyContent="end" gap="base">
              <s-button variant="primary" loading={loading} type="submit">
                Save address
              </s-button>
            </s-grid>
        </s-stack>
          </s-form>

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
          <s-paragraph>Add a product to your order. TODO...</s-paragraph>
        </s-stack>
      </s-stack>
    </s-section>
  );
}
