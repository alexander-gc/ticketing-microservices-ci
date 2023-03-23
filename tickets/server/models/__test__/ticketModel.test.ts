import { Ticket } from "../Ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "123" });
  await ticket.save(); // version 0

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save(); // version 1

  try {
    await secondInstance!.save(); // version 1 but it already exists
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("implements the version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "concert", price: 5, userId: "123" });

  await ticket.save(); // version 0
  expect(ticket.version).toEqual(0);

  await ticket.save(); // version 1
  expect(ticket.version).toEqual(1);

  await ticket.save(); // version 2
  expect(ticket.version).toEqual(2);
});
