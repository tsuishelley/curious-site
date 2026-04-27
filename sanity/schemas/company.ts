import { defineField, defineType } from 'sanity';

export const company = defineType({
  name: 'company',
  title: 'Company',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'acquisitionDate', title: 'Acquisition Date', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'acquisitionDate' },
  },
});
