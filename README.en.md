# User end of the intelligent hospital registration system

### Introduction
The smart registration project is split into three repositories:

1. User Front-End Repository:  https://gitee.com/garveyer/intelligent-registration-user-front  

2. Admin Front-End Repository:  https://gitee.com/garveyer/intelligent-registration-admin-front  

3. Back-End Repository:  https://gitee.com/garveyer/IntelligentRegistrationBack  

User-end web code for the smart registration project. Built with uni-app + Vue3 + Vite, one codebase runs on both WeChat Mini-Program and H5, providing online appointment, AI triage, patient management, order inquiry and other complete workflows.

### Project Highlights

- 🚀 Cross-platform (WeChat Mini-Program & H5)  
- 💡 AI triage recommendation  
- 📱 Full appointment workflow  
- 🎨 Modern UI design  

### Software Architecture

- Front-end: uni-app + Vue3 + TypeScript + Vite  
- UI Library: uview-plus  
- Network: Centralized `tools/request/request.js` with unified timeout, error toast and token intercept  
- State: Vuex modules to store user, patient and current order info  
- Cross-end: Compile to WeChat Mini-Program and H5 (other ends can be extended on demand)  

### Quick Start

#### Environment Requirements

- Node.js ≥ 14  
- pnpm/npm/yarn  

#### Install Dependencies

```
pnpm install
```

#### Development

```
# WeChat Mini-Program
pnpm dev:mp-weixin

# H5
pnpm dev:h5
```

#### Production Build

```
# WeChat Mini-Program
pnpm build:mp-weixin

# H5
pnpm build:h5
```


### Core Features

| Module | Status | Description |
| ----- | -- | --------- |
| Home | ✅ | Banner, quick entries |
| Appointment | ✅ | Department choice, doctor schedule |
| AI Triage | ✅ | AI symptom-based department recommendation |
| Patient Mgmt | ✅ | Add/edit patients |
| Order Mgmt | ✅ | Appointment history, cancellation |
| Profile | ✅ | User info, settings |

### Project Structure
![input image description](https://foruda.gitee.com/images/1758298177129741206/3ee8f162_14478573.png "Screen Shot")

### Page Showcase
## Full Page Overview

| Feature | Page Path | File Name Convention | Preview |
|---|---|---|---|
| Home | pages/index/index | `index.png` | ![Home](./docs/assets/index.png) |
| Department List | pages/index/secondVue/departmentList | `department.png` | ![Department List](./docs/assets/department.png) |
| Doctor Schedule | pages/index/secondVue/doctoList | `doctor-schedule.png` | ![Doctor Schedule](./docs/assets/doctor-schedule.png) |
| Registration Apply | pages/index/secondVue/registrationApplication | `registration-application.png` | ![Registration Apply](./docs/assets/registration-application.png) |
| Registration Success | pages/index/secondVue/registerSuccess | `register-success.png` | ![Registration Success](./docs/assets/order-detail.png) |
| Appointment History | pages/index/secondVue/appointment | `appointment.png` | ![Appointment History](./docs/assets/appointment.png) |
| Patient List | pages/index/secondVue/medicalVisitInformation | `patient-management.png` | ![Patient List](./docs/assets/patient-management.png) |
| Add Patient | pages/index/secondVue/addPatienter | `add-patient.png` | ![Add Patient](./docs/assets/add-patient.png) |
| AI Triage | pages/index/chat | `ai-diagnosis.png` | ![AI Triage](./docs/assets/ai-diagnosis.png) |
| Message Center | pages/index/message | `message.png` | ![Message Center](./docs/assets/message.png) |
| Information | pages/index/infor | `information.png` | ![Information](./docs/assets/information.png) |
| Profile | pages/index/my | `my.png` | ![Profile](./docs/assets/my.png) |
| Account Settings | pages/index/my/accountSettings | `account-settings.png` | ![Account Settings](./docs/assets/account-settings.png) |
| No Service | pages/index/noService | `no-service.png` | ![No Service](./docs/assets/no-service.png) |

> Screenshots are stored in **`docs/assets/`**. Use the exact names listed above; they will auto-load after push.

### Development Standards

- Follow Vue3 Composition API  
- TypeScript type checking required  
- Unified code formatting config  
- Component names in PascalCase  
- Page files in lowercase & hyphen  

### Version History

- v1.0.0 - Basic functions completed
    1. User login/register  
    2. Appointment workflow  
    3. Patient management  
    4. Order management  

### Thanks
Thanks to all contributors!

⭐ If this project helps you, please give it a Star!
