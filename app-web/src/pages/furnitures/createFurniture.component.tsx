import { Button, NumberInput, Paper, Select, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { gql, GraphQLClient } from 'graphql-request';
import React from 'react'
import { useMutation } from 'react-query';
interface NewItem {
    name: String
    style: String
    description: String
    price: number
    deliveryDays: number
}

interface CreateFurniture {
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

function CreateFurniture({setPage} : CreateFurniture) {
    const client = new GraphQLClient("/gql/query");
    const { mutate: createItemMutation } = useMutation(
        async (item: NewItem) => {
            const variables = { ...item }

            const query = gql`mutation createItem {
                createItem(input: {name : "${item.name}" style : "${item.style}" description : "${item.description}" price: ${item.price} deliveryDays: ${item.deliveryDays}}){
                    id
                }
            }`;
            return await client.request(query, variables);
        },
        {
            onSuccess: () => {
                setPage("list")
            },
        }
    );

    const form = useForm({
        initialValues: {
            name: "",
            style: "",
            description: "",
            price: 0,
            deliveryDays: 0,
        },
    });

    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Title order={2}>
                New Item
            </Title>
            <form
                onSubmit={form.onSubmit((values) => {
                    createItemMutation({ ...values });
                })}
            >
                <TextInput
                    label="Name"
                    placeholder="you@mantine.dev"
                    required
                    {...form.getInputProps("name")}
                />
                <Select
                    label="Style"
                    placeholder="Pick one"
                    required
                    data={[
                        { value: 'Conteporary', label: 'Conteporary' },
                        { value: 'Modern', label: 'Modern' },
                        { value: 'Scandinavian', label: 'Scandinavian' },
                        { value: 'Classic', label: 'Classic' },
                        { value: 'Midcentury', label: 'Midcentury' },
                    ]}
                    {...form.getInputProps("style")}
                />
                <NumberInput
                    label="Price"
                    required
                    {...form.getInputProps("price")}
                />
                <NumberInput
                    label="Delivery Days"
                    placeholder="you@mantine.dev"
                    required
                    {...form.getInputProps("deliveryDays")}
                />
                <Textarea
                    label="Description"
                    placeholder="Description"
                    required
                    {...form.getInputProps("description")} />

                <Button fullWidth mt="xl" type="submit">
                    Create Item
                </Button>
            </form>
        </Paper>
    )
}

export default CreateFurniture