import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(
      100,
      "Name is too long.",
    ),

  email: z
    .string()
    .trim()
    .email(
      "Enter a valid email address.",
    )
    .max(200),

  topic: z.enum([
    "search",
    "reservation",
    "account",
    "pharmacy",
  ]),

  message: z
    .string()
    .trim()
    .min(
      5,
      "Please enter a message.",
    )
    .max(
      3000,
      "Message must be below 3000 characters.",
    ),
});

const topicLabels = {
  search: "Medicine Search",
  reservation: "Reservation",
  account: "Account",
  pharmacy: "Pharmacy",
} as const;

function escapeHtml(
  value: string,
) {
  return value
    .replaceAll(
      "&",
      "&amp;",
    )
    .replaceAll(
      "<",
      "&lt;",
    )
    .replaceAll(
      ">",
      "&gt;",
    )
    .replaceAll(
      '"',
      "&quot;",
    )
    .replaceAll(
      "'",
      "&#039;",
    );
}

export async function POST(
  request: Request,
) {
  try {
    const body: unknown =
      await request.json();

    const parsed =
      contactSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error
              .issues[0]
              ?.message ??
            "Invalid contact form.",
        },
        {
          status: 400,
        },
      );
    }

    const apiKey =
      process.env
        .RESEND_API_KEY;

    const fromEmail =
      process.env
        .CONTACT_FROM_EMAIL;

    const toEmail =
      process.env
        .CONTACT_TO_EMAIL;

    if (
      !apiKey ||
      !fromEmail ||
      !toEmail
    ) {
      console.error(
        "Contact email environment variables are missing.",
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Email service is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const {
      name,
      email,
      topic,
      message,
    } = parsed.data;

    const topicLabel =
      topicLabels[topic];

    const safeName =
      escapeHtml(name);

    const safeEmail =
      escapeHtml(email);

    const safeTopic =
      escapeHtml(
        topicLabel,
      );

    const safeMessage =
      escapeHtml(
        message,
      ).replaceAll(
        "\n",
        "<br />",
      );

    const resendResponse =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            {
              from:
                fromEmail,

              to: [
                toEmail,
              ],

              subject:
                `MediFlux Support - ${topicLabel}`,

              reply_to:
                email,

              text: `
New MediFlux support request

Name: ${name}
Email: ${email}
Topic: ${topicLabel}

Message:
${message}
              `.trim(),

              html: `
<!doctype html>

<html>
  <body
    style="
      margin: 0;
      padding: 30px;
      background: #f4faf7;
      font-family:
        Arial,
        Helvetica,
        sans-serif;
      color: #12382d;
    "
  >
    <div
      style="
        max-width: 620px;
        margin: 0 auto;
      "
    >
      <div
        style="
          overflow: hidden;
          border:
            1px solid
            #dce9e3;
          border-radius:
            20px;
          background:
            #ffffff;
          box-shadow:
            0 20px 60px
            rgba(
              7,
              68,
              50,
              0.08
            );
        "
      >
        <div
          style="
            padding:
              28px 32px;
            background:
              linear-gradient(
                135deg,
                #06392c,
                #087355
              );
            color:
              white;
          "
        >
          <div
            style="
              font-size:
                26px;
              font-weight:
                800;
            "
          >
            MediFlux
          </div>

          <div
            style="
              margin-top:
                7px;
              opacity:
                0.75;
              font-size:
                13px;
            "
          >
            Customer Support
            Request
          </div>
        </div>

        <div
          style="
            padding:
              32px;
          "
        >
          <p
            style="
              margin-top:
                0;
              color:
                #789087;
              font-size:
                11px;
              font-weight:
                700;
              letter-spacing:
                0.08em;
              text-transform:
                uppercase;
            "
          >
            New support message
          </p>

          <h2
            style="
              margin:
                10px 0
                28px;
              color:
                #07392c;
            "
          >
            ${safeTopic}
          </h2>

          <table
            style="
              width:
                100%;
              border-collapse:
                collapse;
            "
          >
            <tr>
              <td
                style="
                  width:
                    110px;
                  padding:
                    10px 0;
                  color:
                    #789087;
                "
              >
                Name
              </td>

              <td
                style="
                  padding:
                    10px 0;
                  font-weight:
                    700;
                "
              >
                ${safeName}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:
                    10px 0;
                  color:
                    #789087;
                "
              >
                Email
              </td>

              <td
                style="
                  padding:
                    10px 0;
                  font-weight:
                    700;
                "
              >
                ${safeEmail}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:
                    10px 0;
                  color:
                    #789087;
                "
              >
                Topic
              </td>

              <td
                style="
                  padding:
                    10px 0;
                  font-weight:
                    700;
                "
              >
                ${safeTopic}
              </td>
            </tr>
          </table>

          <div
            style="
              margin-top:
                25px;
              padding:
                20px;
              border-radius:
                14px;
              background:
                #f3faf7;
              color:
                #24483d;
              line-height:
                1.7;
            "
          >
            ${safeMessage}
          </div>

          <p
            style="
              margin:
                28px 0 0;
              color:
                #91a39c;
              font-size:
                11px;
            "
          >
            Sent from the
            MediFlux customer
            support form.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
              `,
            },
          ),
        },
      );

    const resendData:
      unknown =
      await resendResponse.json();

    if (
      !resendResponse.ok
    ) {
      console.error(
        "Resend API error:",
        resendData,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not send the email.",
        },
        {
          status: 502,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Message sent successfully.",

        data:
          resendData,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Contact API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while sending your message.",
      },
      {
        status: 500,
      },
    );
  }
}