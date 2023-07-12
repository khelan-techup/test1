export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: '',
      },
    },
    //{
    //  name: 'Master',
    //  url: '/master',
    //  icon: 'icon-puzzle',
    //  children: [
    //    {
    //      name: 'Role',
    //      url: '/master/role/list',
    //      icon: '',
    //    },
    //    {
    //      name: 'Disease',
    //      url: '/master/diseases/list',
    //      icon: '',
    //    },
    //    {
    //      name: 'Portal Module',
    //      url: '/master/portalmodule/list',
    //      icon: '',
    //    },
    //    {
    //      name: 'Role Module Mapping',
    //      url: '/master/rolemodule/list',
    //      icon: '',
    //    },
    //    {
    //      name: 'Organization User',
    //      url: '/master/organizationuser/list',
    //      icon: '',
    //    },
    //  ],
    //},
    {
      name: 'Patients',
      url: '/Patient',
      icon: 'icon-puzzle',
      children: [    
        {
          name: 'Information',
          url: '/patients/list',
          icon: '',
        },
      ],
    },
    {
      name: 'Practitioners',
      url: '/practitioner',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Information',
          url: '/practitioners/list',
          icon: '',
        },
      ],
    },
    {
      name: 'institution',
      url: '/institute',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Information',
          url: '/institutes/list',
          icon: '',
        },
      ],
    },
    {
      name: 'Laboratory',
      url: '/ngslaboratory',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Information',
          url: '/ngslaboratory/list',
          icon: '',
        },
        
      ],
    },
    {
      name: 'Manufacturer',
      url: '/manufacturer',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Information',
          url: '/manufacturer/list',
          icon: '',
        },

      ],
    },
    {
      name: 'Payment Transaction',
      url: '/paymenthistory',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: '',
      },
    },
    {
      name: 'Patient Design Activity',
      url: '/patient/designactivity',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: '',
      },
    },
  ],
};
