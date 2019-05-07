export default {
  data: [
    {
      id: "1",
      name: "Title",
      description: "Description",
      owners: [
        {
          id: "string",
          name: "string",
          type: "team"
        }
      ],
      approvers: [
        {
          id: "string",
          name: "string",
          type: "team"
        }
      ],
      hasErrors: true,
      status: "draft"
    },
    {
      id: "2",
      name: "Title",
      description: "Description",
      owners: [
        {
          id: "string",
          name: "string",
          type: "team"
        }
      ],
      approvers: [
        {
          id: "string",
          name: "string",
          type: "team"
        }
      ],
      hasErrors: true,
      status: "draft"
    },
    {
      id: "3",
      name: "Title",
      description: "Description",
      owners: [
        {
          id: "string",
          name: "string",
          type: "team"
        }
      ],
      approvers: [
        {
          id: "string",
          name: "string",
          type: "team"
        }
      ],
      hasErrors: true,
      status: "draft"
    }
  ],
  links: {
    first: "http://myapi?page=0&size=100",
    previous: "http://myapi?page=1&size=100",
    next: "http://myapi?page=3&size=100",
    last: "http://myapi?page=4&size=100"
  },
  page: {
    size: 100,
    totalElements: 436,
    totalPages: 5,
    number: 2
  }
};
