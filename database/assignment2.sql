--QUERY 1
INSERT INTO public.account(
	account_firstname, account_lastname, account_email, account_password)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--QUERY 2
UPDATE public.account
	SET account_type='Admin'
	WHERE account_id = 1;

--QUERY 3
DELETE FROM public.account
	WHERE account_id = 2;
    
--QUERY 4
UPDATE public.inventory
	SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you the huge interior with an engine to get you out of any muddy or rocky situation.'
	WHERE inv_id = 10;

--QUERY 5
SELECT inv.inv_make, inv.inv_make 
FROM public.inventory inv
	INNER JOIN public.classification cl
	ON inv.classification_id = cl.classification_id
WHERE classification_name = 'Sport'

--QUERY 6
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');