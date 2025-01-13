This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



<Flex align="end" justify="between" mb="2">
						<Box>
							<Flex mb="1">
								<Link
									href="#"
									underline="hover"
									size="2"
									color="gray"
									highContrast
									tabIndex={tabIndex}
									onClick={(e) => e.preventDefault()}
								>
									Footwear
								</Link>
							</Flex>

							<Heading as="h3" size="3">
								Sneakers #12
							</Heading>
						</Box>

						<Text size="6" weight="bold">
							$149
						</Text>
					</Flex>

					<Text as="p" size="2" color="gray" mb="4">
						Love at the first sight for enthusiasts seeking a fresh and
						whimsical style.
					</Text>

					<Box>
						<Separator size="4" my="4" />
					</Box>

					<Flex gap="2" align="end">
						<Flex direction="column" flexGrow="1">
							<Label asChild>
								<Text size="1" color="gray" mb="1">
									Color
								</Text>
							</Label>

							<Select.Root defaultValue="Pastel" size="2">
								<Select.Trigger tabIndex={tabIndex} variant="soft" />
								<Select.Content
									variant="soft"
									container={portalContainer}
									position="popper"
								>
									<Select.Item value="Pastel">Pastel</Select.Item>
									<Select.Item value="Bright">Bright</Select.Item>
								</Select.Content>
							</Select.Root>
						</Flex>

						<Flex direction="column" minWidth="80px">
							<Label asChild>
								<Text size="1" color="gray" mb="1">
									Size
								</Text>
							</Label>
							<Select.Root defaultValue="8" size="2">
								<Select.Trigger tabIndex={tabIndex} variant="soft" />
								<Select.Content
									variant="soft"
									container={portalContainer}
									position="popper"
								>
									{Array.from({ length: 12 }, (_, i) => (
										<Select.Item key={i} value={String(i * 0.5 + 5)}>
											{i * 0.5 + 5}
										</Select.Item>
									))}
								</Select.Content>
							</Select.Root>
						</Flex>

						<Button
							tabIndex={tabIndex}
							size="2"
							variant="solid"
							color="gray"
							highContrast
						>
							Buy
						</Button>
					</Flex>
				</Card>

