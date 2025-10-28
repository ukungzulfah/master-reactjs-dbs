import _ from "lodash";
import { Center, Text, Click, Column, Container, Expanded, Icon, MediaQuery, Positioned, Row, Space, Markdown, SingleChildScrollView } from "../../System/Lib/Widgets";

const aboutUs = `# About Us

Welcome to our platform, the ultimate API-driven project ecosystem designed to accelerate your product development and streamline your workflows.

From small prototypes to large enterprise systems, our solutions are tailored to provide flexibility, speed, and reliability at every level. Whether you're building a dynamic frontend with our **Mobile Builder Engine**, managing complex business rules through **Flutter Tag Manager**, or automating backend workflows with our advanced **Syntax Engine**, our mission is to empower developers and businesses to achieve more with less effort.

Our team consists of passionate engineers, researchers, and creators who have spent years perfecting systems that not only scale, but also adapt to the ever-changing technology landscape. With a deep focus on modularity and developer experience, we offer robust APIs, real-time rendering, and seamless integrations so you can focus on what matters most: creating amazing experiences for your users.

## Our Vision

To become the backbone of modern app development by providing powerful, intuitive, and scalable solutions that simplify complex tasks and empower developers worldwide.

## Our Products

### 🔧 Mobile Builder Engine

A dynamic page rendering engine that allows apps to receive encrypted JSON structures defining routes and layouts. With this, mobile applications can change UI/UX behavior without resubmitting to app stores.

### 🏷️ Flutter Tag Manager

A CMS-driven rule engine that moves business logic to the backend, allowing frontend apps to render and behave based on rules and conditions in real time.

### 🧠 Syntax Engine

An AI-optimized transpiler that converts Flutter syntax to React.js components, removing the need for JSX and improving rendering performance dramatically.

### 📈 AdBrief-AI

A smart assistant for marketing teams to auto-generate briefs based on campaign goals, targets, and past performance data, powered by fast inference AI models.

### 🌊 Solar Wave Energy

Our innovation initiative in renewable energy, focused on generating clean electricity from ocean waves using floating turbines and intelligent monitoring.

## Privacy Policy

### Information We Collect

We collect minimal information necessary to provide our services, including user email, project data, and access logs. Sensitive information such as payment details is processed securely through third-party providers.

### How We Use Data

* To operate and maintain the platform
* To improve our services and develop new features
* To communicate with users regarding their projects
* To ensure the security and integrity of our services

### Data Sharing

We do not sell or share your personal data with third parties except:

* When required by law
* To protect our legal rights
* To facilitate necessary service providers (such as hosting or security services)

### Data Retention

User data is retained as long as necessary to provide services. Upon account deletion, associated data will be securely removed within 30 days.

### Security

We implement industry-standard security practices, including encrypted data storage, secure API access, and periodic audits to ensure data protection.

### User Rights

Users have the right to access, modify, or delete their data at any time. Contact our support for any requests.

## Contact Us

If you have any questions, feedback, or require assistance, please reach out to us at:

**Email:** [support@ourplatform.com](mailto:support@ourplatform.com)
**Phone:** +62 800-1234-5678
**Address:** Jl. Developer No. 7, Depok, Indonesia

---

*Empowering developers. Simplifying complexity. Building the future.*


`;

export default function AboutComponent(_: any) {
    
  return Positioned({
    left: (MediaQuery.width() - 800) / 2,
    top: 20,
    color: "white",
    width: 800,
    height: "75%",
    radius: 10,
    shadow: true,
    overflow: "hidden",
    child: Column({
      children: [
        Container({
          color: "#e9ecef",
          height: 40,
          child: Row({
            children: [
              Space(5),
              Container({
                width: 40,
              }),
              Expanded({
                child: Center({
                  child: Text("About", { fontWeight: "600", color: "#495057" })
                })
              }),
              Container({
                width: 40,
                height: 40,
                child: Click({
                  click: () => {
                    _.close();
                  },
                  child: Center({
                    child: Icon('close')
                  })
                })
              })
            ]
          })
        }),
        Expanded({
            child: SingleChildScrollView({
                child: Container({
                    padding: 20,
                    child: Markdown({
                        markdown: aboutUs
                    })
                })
            })
        })
      ]
    })
  }).builder();
}