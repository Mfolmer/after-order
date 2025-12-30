import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { authenticate, unauthenticated } from "../shopify.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("update-shipping loader");
  await authenticate.public.customerAccount(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("update-shipping action");
  const { cors, sessionToken } = await authenticate.public.customerAccount(request);

  if (request.method !== "POST") {
    return cors(Response.json({ error: "Method not allowed" }, { status: 405 }));
  }

  try {
    const body = await request.json();
    console.log("update-shipping body", body);
    const { orderId, shippingAddress } = body;

    if (!orderId) {
      return cors(Response.json({ error: "Missing required fields" }, { status: 400 }));
    }

    const shop = sessionToken.dest;

    if (!shop) {
        return cors(Response.json({ error: "Invalid session token" }, { status: 401 }));
    }

    const { admin } = await unauthenticated.admin(shop);

    if (!admin) {
      return cors(Response.json({ error: "Could not establish admin session" }, { status: 500 }));
    }

    // 2. SECURITY CHECK: Fetch order to verify it belongs to this shop
    // This prevents someone from passing an order ID from a different store
    const checkResponse = await admin.graphql(`#graphql
      query checkOrder($id: ID!) {
        order(id: $id) {
          id
        }
      }
    `, { variables: { id: orderId } });

    const checkData = await checkResponse.json();
    
    // If order doesn't exist or doesn't belong to this store's API scope, admin will return null
    if (!checkData.data?.order) {
       return cors(Response.json({ error: "Unauthorized order access" }, { status: 403 }));
    }

    // Perform the update
    const updateMutation = `#graphql
      mutation orderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              zip
              phone
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    console.log("update-shipping shippingAddress", shippingAddress);

    const updateResponse = await admin.graphql(updateMutation, {
      variables: {
        input: {
          id: orderId,
          shippingAddress: shippingAddress
        },
      },
    });

    const updateData = await updateResponse.json();
    //console.log("update-shipping updateData", updateData);
    if (updateData.data?.orderUpdate?.userErrors?.length > 0) {
      return cors(
        Response.json(
          { errors: updateData.data.orderUpdate.userErrors },
          { status: 400 }
        )
      );
    }

    return cors(Response.json({ order: updateData.data.orderUpdate.order }));
  } catch (error) {
    console.error("Error updating shipping address:", error);
    return cors(Response.json({ error: "Internal server error" }, { status: 500 }));
  }
};
